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
   * Exibe página de estorno seguro, sugerindo a transação elegível
   */
  async showRefundPage({ auth, request, inertia, session }: HttpContext) {
    const user = auth.user!

    // Pode vir por querystring ou da sessão do fluxo PIX
    const qs = request.qs()
    const pixData = session.get('pixData')

    const transactionId = qs.transactionId ? Number(qs.transactionId) : undefined
    const receiverId = qs.receiverId ? Number(qs.receiverId) : pixData?.receiverId
    const amount = qs.amount ? Number(qs.amount) : pixData?.amount

    let candidate: Transaction | null = null

    if (transactionId) {
      // Busca transação específica se o ID foi informado
      candidate = await Transaction.query()
        .where('id', transactionId)
        .where('receiver_id', user.id)
        .where('status', 'completed')
        .where('type', 'PIX')
        .preload('sender')
        .first()
    } else if (receiverId && amount) {
      // Busca transação recente compatível com alerta
      candidate = await Transaction.query()
        .where('sender_id', receiverId)
        .where('receiver_id', user.id)
        .where('amount', amount)
        .where('type', 'PIX')
        .where('status', 'completed')
        .where('created_at', '>=', db.raw("datetime('now', '-7 days')"))
        .preload('sender')
        .orderBy('created_at', 'desc')
        .first()
    }

    if (!candidate) {
      // Nada elegível para estorno
      return inertia.render('estorno', {
        user: { fullName: user.fullName, balance: Number(user.balance) },
        eligible: null,
        message: 'Nenhuma transação elegível para estorno foi encontrada para os dados informados.',
      })
    }

    // Verifica se já foi estornado
    const alreadyRefunded = await Transaction.query()
      .where('sender_id', user.id)
      .where('receiver_id', candidate.senderId)
      .where('amount', candidate.amount)
      .where('type', 'REFUND')
      .whereRaw('created_at > ?', [candidate.createdAt.toISO() || ''])
      .first()

    return inertia.render('estorno', {
      user: { fullName: user.fullName, balance: Number(user.balance) },
      eligible: {
        id: candidate.id,
        name: candidate.sender?.fullName || 'Desconhecido',
        amount: Number(candidate.amount),
        date: candidate.createdAt.toFormat('dd LLL yyyy - HH:mm:ss'),
        alreadyRefunded: !!alreadyRefunded,
      },
      message: null,
    })
  }

  /**
   * Exibe a tela de inserção de valor com dados do destinatário validado
   */
  async showValor({ auth, request, response, inertia, session }: HttpContext) {
    const user = auth.user!
    const { identifier } = request.only(['identifier'])

    if (!identifier) {
      session.flash('error', 'Chave PIX não informada')
      return response.redirect('/pix')
    }

    // Busca o destinatário por CPF, email ou telefone
    const receiver = await User.query()
      .where('cpf', identifier)
      .orWhere('email', identifier)
      .orWhere('phone', identifier)
      .first()

    if (!receiver) {
      session.flash('error', 'Chave PIX não encontrada. Verifique e tente novamente.')
      return response.redirect().toRoute('pix.create')
    }

    if (receiver.id === user.id) {
      session.flash('error', 'Você não pode enviar PIX para si mesmo')
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
        cpf: `${receiver.cpf.slice(0, 3)}.***.***-**${receiver.cpf.slice(-2)}`,
        pixKey: identifier,
      },
    })
  }

  /**
   * Valida destinatário e verifica alertas de possível golpe
   */
  async validate({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const { receiverId, amount, receiverPixKey } = request.all()

    // Busca o destinatário por CPF, email ou telefone
    const receiver = await User.query().where('id', receiverId).first()

    if (!receiver) {
      session.flash('error', 'Destinatário não encontrado')
      return response.redirect('/pix')
    }

    if (receiver.id === user.id) {
      session.flash('error', 'Você não pode enviar PIX para si mesmo')
      return response.redirect('/pix')
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

    logger.info(
      `Validação PIX - receiverId: ${receiver.id}, amount: ${amount}, hasAlert: ${hasAlert}`
    )

    // Armazena dados na sessão para as próximas etapas
    session.put('pixData', {
      receiverId: receiver.id,
      amount: amount,
      receiverFullName: receiver.fullName,
      receiverCpf: receiver.cpf,
      receiverPixKey: receiverPixKey,
    })

    // Redireciona para a página apropriada
    if (hasAlert) {
      return response.redirect('/pixatencao')
    } else {
      return response.redirect('/pixconfirmar')
    }
  }

  /**
   * Exibe tela de atenção (possível golpe)
   */
  async showAtencao({ auth, request, response, inertia, session }: HttpContext) {
    const user = auth.user!
    const pixData = session.get('pixData')
    const qs = request.qs()

    const receiverId = qs.receiverId ? Number(qs.receiverId) : pixData?.receiverId
    const amount = qs.amount ? Number(qs.amount) : pixData?.amount

    if (!receiverId || !amount) {
      session.flash('error', 'Dados incompletos')
      return response.redirect('/pix')
    }

    const receiver = await User.findOrFail(receiverId)

    // Busca transação recente para montar mensagem
    const recentTransaction = await Transaction.query()
      .where('sender_id', receiver.id)
      .where('receiver_id', user.id)
      .where('amount', amount)
      .where('type', 'PIX')
      .where('status', 'completed')
      .where('created_at', '>=', db.raw("datetime('now', '-7 days')"))
      .first()

    const alertMessage = recentTransaction
      ? `Você recebeu recentemente R$ ${Number(amount).toFixed(2)} de ${receiver.fullName}. Isso pode ser uma tentativa de golpe! Se foi um valor enviado por engano, NÃO devolva via PIX. Use o botão de ESTORNO SEGURO para evitar fraudes.`
      : `Esta transação pode apresentar riscos. Verifique cuidadosamente os dados antes de continuar.`

    return inertia.render('pixatencao', {
      user: {
        fullName: user.fullName,
        balance: user.balance,
      },
      receiver: {
        id: receiver.id,
        fullName: receiver.fullName,
        cpf: `${receiver.cpf.slice(0, 3)}.***.***-**${receiver.cpf.slice(-2)}`,
        pixKey: pixData?.receiverPixKey || receiver.cpf,
      },
      amount: Number(amount),
      alertMessage,
    })
  }

  /**
   * Exibe tela de confirmação final
   */
  async showConfirmar({ auth, request, response, inertia, session }: HttpContext) {
    const user = auth.user!
    const pixData = session.get('pixData')
    const qs = request.qs()

    const receiverId = qs.receiverId ? Number(qs.receiverId) : pixData?.receiverId
    const amount = qs.amount ? Number(qs.amount) : pixData?.amount

    logger.info(`ROTA PIX CONFIRMAR ACESSADA - receiverId: ${receiverId}, amount: ${amount}`)

    if (!receiverId || !amount) {
      session.flash('error', 'Dados incompletos')
      return response.redirect('/pix')
    }

    const receiver = await User.findOrFail(receiverId)

    return inertia.render('pixconfirmar', {
      user: {
        fullName: user.fullName,
        balance: user.balance,
      },
      receiver: {
        id: receiver.id,
        fullName: receiver.fullName,
        cpf: `${receiver.cpf.slice(0, 3)}.***.***-**${receiver.cpf.slice(-2)}`,
        pixKey: pixData?.receiverPixKey || receiver.cpf,
      },
      amount: Number(amount),
    })
  }

  /**
   * Processa a transferência PIX
   */
  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const { receiverId, amount } = request.only(['receiverId', 'amount'])

    const parsedAmount = parseFloat(amount)

    if (parsedAmount <= 0 || isNaN(parsedAmount)) {
      session.flash('error', 'Valor inválido')
      return response.redirect('/pix')
    }

    if (user.balance < parsedAmount) {
      session.flash('error', 'Saldo insuficiente')
      return response.redirect('/pix')
    }

    const receiver = await User.findOrFail(receiverId)

    if (receiver.id === user.id) {
      session.flash('error', 'Você não pode enviar PIX para si mesmo')
      return response.redirect('/pix')
    }

    // Inicia transação no banco
    const trx = await db.transaction()

    try {
      // Calcula novos saldos com coerção explícita
      const senderCurrent = Number(user.balance)
      const receiverCurrent = Number(receiver.balance)
      const senderNew = senderCurrent - parsedAmount
      const receiverNew = receiverCurrent + parsedAmount

      // Atualiza saldos diretamente via SQL dentro da mesma transação
      await User.query({ client: trx }).where('id', user.id).update({ balance: senderNew })
      await User.query({ client: trx }).where('id', receiver.id).update({ balance: receiverNew })

      // Registra a transação
      await Transaction.create(
        {
          senderId: user.id,
          receiverId: receiver.id,
          amount: parsedAmount,
          type: 'PIX',
          status: 'completed',
        },
        { client: trx }
      )

      await trx.commit()

      // Limpa dados temporários do fluxo PIX
      session.forget('pixData')

      session.flash('success', 'Transferência realizada com sucesso!')

      // Armazena dados da transação para a página de sucesso
      session.put('lastTransaction', {
        receiverFullName: receiver.fullName,
        amount: parsedAmount,
      })

      return response.redirect('/enviado')
    } catch (error) {
      await trx.rollback()
      logger.error('Erro ao processar PIX', { error })
      session.flash('error', 'Erro ao processar a transação')
      return response.redirect('/pix')
    }
  }

  /**
   * Processa estorno seguro (apenas para quem recebeu)
   */
  async refund({ auth, request, response, session }: HttpContext) {
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
      // Usa queries diretas dentro da transação para garantir atomicidade
      const userCurrent = Number(user.balance)
      const senderCurrent = Number(sender.balance)
      const amt = Number(transaction.amount)

      const userNew = userCurrent - amt
      const senderNew = senderCurrent + amt

      await User.query({ client: trx }).where('id', user.id).update({ balance: userNew })
      await User.query({ client: trx }).where('id', sender.id).update({ balance: senderNew })

      await Transaction.create(
        {
          senderId: user.id,
          receiverId: sender.id,
          amount: amt,
          type: 'REFUND',
          status: 'completed',
        },
        { client: trx }
      )

      await Transaction.query({ client: trx })
        .where('id', transaction.id)
        .update({ status: 'refunded' })

      await trx.commit()

      // Flash e redirect para extrato (ou conta) garantindo feedback Inertia
      session.flash('success', 'Estorno realizado com sucesso')
      return response.redirect('/extrato')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Erro ao processar o estorno')
      return response.redirect('/informacaopix/' + transaction.id)
    }
  }

  /**
   * Exibe página de conta com saldo atualizado
   */
  async showAccount({ auth, inertia }: HttpContext) {
    logger.info(`ROTA CONTA ACESSADA`)
    const user = auth.user!
    // Recarrega o usuário para garantir saldo atualizado
    await user.refresh()

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

  /**
   * Exibe página de sucesso da transferência
   */
  async showEnviado({ auth, inertia, session }: HttpContext) {
    const user = auth.user!
    // Garante que o saldo exibido reflita a última transação
    await user.refresh()
    const lastTransaction = session.get('lastTransaction')

    return inertia.render('enviado', {
      user: {
        fullName: user.fullName,
        balance: Number(user.balance),
      },
      transaction: lastTransaction || {
        receiverFullName: 'Destinatário',
        amount: 0,
      },
    })
  }
}
