import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'

export default class PixController {
  /**
   * Exibe a tela inicial do PIX
   */
  async create({ auth, inertia }: HttpContext) {
    const user = auth.user!

    return inertia.render('pix', {
      user: {
        fullName: user.fullName,
        balance: user.balance,
      },
    })
  }

  /**
   * Exibe a tela de inserção de valor com dados do destinatário validado
   */
  async showValor({ auth, request, response, inertia }: HttpContext) {
    const user = auth.user!
    const { identifier } = request.qs()

    if (!identifier) {
      return response.redirect('/pix')
    }

    // Busca o destinatário por CPF, email ou telefone
    const receiver = await User.query()
      .where('cpf', identifier)
      .orWhere('email', identifier)
      .orWhere('phone', identifier)
      .first()

    if (!receiver) {
      return response.redirect().toRoute('pix.create')
    }

    if (receiver.id === user.id) {
      return response.redirect().toRoute('pix.create')
    }

    return inertia.render('pixvalor', {
      user: {
        fullName: user.fullName,
        balance: user.balance,
      },
      receiver: {
        id: receiver.id,
        fullName: receiver.fullName,
        cpf: receiver.cpf,
        pixKey: identifier,
      },
    })
  }

  /**
   * Valida destinatário e verifica alertas de possível golpe
   */
  async validate({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { identifier, amount } = request.only(['identifier', 'amount'])

    // Busca o destinatário por CPF, email ou telefone
    const receiver = await User.query()
      .where('cpf', identifier)
      .orWhere('email', identifier)
      .orWhere('phone', identifier)
      .first()

    if (!receiver) {
      return response.badRequest({
        error: 'Destinatário não encontrado',
      })
    }

    if (receiver.id === user.id) {
      return response.badRequest({
        error: 'Você não pode enviar PIX para si mesmo',
      })
    }

    // Verifica se há transações recentes do destinatário para o usuário com o mesmo valor
    const recentTransaction = await Transaction.query()
      .where('sender_id', receiver.id)
      .where('receiver_id', user.id)
      .where('amount', amount)
      .where('type', 'PIX')
      .where('status', 'completed')
      .where('created_at', '>=', db.raw("datetime('now', '-7 days')"))
      .first()

    const hasAlert = !!recentTransaction

    return response.ok({
      receiver: {
        id: receiver.id,
        fullName: receiver.fullName,
        cpf: receiver.cpf,
      },
      amount,
      hasAlert,
      alertMessage: hasAlert
        ? `Atenção! Você recebeu recentemente R$ ${amount.toFixed(2)} de ${receiver.fullName}. Se foi um valor enviado por engano, NÃO devolva via PIX. Use o botão de ESTORNO para evitar golpes.`
        : null,
    })
  }

  /**
   * Processa a transferência PIX
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { receiverId, amount } = request.only(['receiverId', 'amount'])

    const parsedAmount = parseFloat(amount)

    if (parsedAmount <= 0 || isNaN(parsedAmount)) {
      return response.badRequest({
        error: 'Valor inválido',
      })
    }

    if (user.balance < parsedAmount) {
      return response.badRequest({
        error: 'Saldo insuficiente',
      })
    }

    const receiver = await User.findOrFail(receiverId)

    if (receiver.id === user.id) {
      return response.badRequest({
        error: 'Você não pode enviar PIX para si mesmo',
      })
    }

    // Inicia transação no banco
    const trx = await db.transaction()

    try {
      // Debita do remetente
      user.balance -= parsedAmount
      await user.save()

      // Credita ao destinatário
      receiver.balance += parsedAmount
      await receiver.save()

      // Registra a transação
      const transaction = await Transaction.create({
        senderId: user.id,
        receiverId: receiver.id,
        amount: parsedAmount,
        type: 'PIX',
        status: 'completed',
      })

      await trx.commit()

      return response.created({
        success: true,
        transaction: {
          id: transaction.id,
          receiverName: receiver.fullName,
          amount: parsedAmount,
        },
      })
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({
        error: 'Erro ao processar a transação',
      })
    }
  }

  /**
   * Processa estorno seguro (apenas para quem recebeu)
   */
  async refund({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { transactionId } = request.only(['transactionId'])

    const transaction = await Transaction.query()
      .where('id', transactionId)
      .where('receiver_id', user.id) // Apenas quem recebeu pode estornar
      .where('status', 'completed')
      .preload('sender')
      .first()

    if (!transaction) {
      return response.badRequest({
        error: 'Transação não encontrada ou você não tem permissão para estorná-la',
      })
    }

    // Verifica se já foi estornado
    const alreadyRefunded = await Transaction.query()
      .where('sender_id', user.id)
      .where('receiver_id', transaction.senderId)
      .where('amount', transaction.amount)
      .where('type', 'REFUND')
      .whereRaw('created_at > ?', [transaction.createdAt.toISO() || ''])
      .first()

    if (alreadyRefunded) {
      return response.badRequest({
        error: 'Esta transação já foi estornada',
      })
    }

    const sender = transaction.sender

    if (user.balance < transaction.amount) {
      return response.badRequest({
        error: 'Saldo insuficiente para estornar',
      })
    }

    // Inicia transação no banco
    const trx = await db.transaction()

    try {
      // Debita de quem está estornando
      user.balance -= transaction.amount
      await user.save()

      // Credita ao remetente original
      sender.balance += transaction.amount
      await sender.save()

      // Registra o estorno
      const refundTransaction = await Transaction.create({
        senderId: user.id,
        receiverId: sender.id,
        amount: transaction.amount,
        type: 'REFUND',
        status: 'completed',
      })

      // Marca a transação original como estornada
      transaction.status = 'refunded'
      await transaction.save()

      await trx.commit()

      return response.ok({
        success: true,
        transaction: {
          id: refundTransaction.id,
          receiverName: sender.fullName,
          amount: transaction.amount,
        },
      })
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({
        error: 'Erro ao processar o estorno',
      })
    }
  }

  /**
   * Exibe página de conta com saldo atualizado
   */
  async showAccount({ auth, inertia }: HttpContext) {
    logger.info(`ROTA CONTA ACESSADA`)
    const user = auth.user!

    return inertia.render('Conta', {
      user: {
        fullName: user.fullName,
        // balance pode vir como string do banco, garantir número
        balance: Number(user.balance),
        account: `40028922-${user.id}`,
        agency: '0001',
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
      },
    })
  }
}
