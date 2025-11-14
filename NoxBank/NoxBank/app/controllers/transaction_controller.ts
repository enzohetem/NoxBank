import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'

export default class TransactionController {
  /**
   * Retorna o extrato de transações do usuário autenticado
   */
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!

    // Busca todas as transações onde o usuário é sender ou receiver
    const transactions = await Transaction.query()
      .where('sender_id', user.id)
      .orWhere('receiver_id', user.id)
      .preload('sender')
      .preload('receiver')
      .orderBy('created_at', 'desc')
      .limit(20)

    // Formata as transações para o frontend
    const formattedTransactions = transactions.map((transaction) => {
      const isSent = transaction.senderId === user.id
      const otherUser = isSent ? transaction.receiver : transaction.sender

      return {
        id: transaction.id,
        name: otherUser?.fullName || 'Desconhecido',
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        date: transaction.createdAt.toFormat('dd LLL yyyy - HH:mm:ss'),
        isSent,
      }
    })

    return inertia.render('extrato', {
      user: {
        fullName: user.fullName,
        balance: Number(user.balance),
        account: `40028922-${user.id}`,
        agency: '0001',
      },
      transactions: formattedTransactions,
    })
  }

  /**
   * Exibe detalhes de uma transação específica
   */
  async show({ auth, params, inertia }: HttpContext) {
    const user = auth.user!
    const transaction = await Transaction.query()
      .where('id', params.id)
      .andWhere((query) => {
        query.where('sender_id', user.id).orWhere('receiver_id', user.id)
      })
      .preload('sender')
      .preload('receiver')
      .firstOrFail()

    const isSent = transaction.senderId === user.id
    const otherUser = isSent ? transaction.receiver : transaction.sender

    return inertia.render('informacaopix', {
      transaction: {
        id: transaction.id,
        name: otherUser?.fullName || 'Desconhecido',
        cpf: otherUser?.cpf || 'Não informado',
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        date: transaction.createdAt.toFormat('dd LLL yyyy - HH:mm:ss'),
        isSent,
        canRefund: !isSent && transaction.status === 'completed',
      },
    })
  }
}
