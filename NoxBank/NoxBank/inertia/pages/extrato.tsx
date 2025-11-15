import { Head, router } from '@inertiajs/react'
import LogoutButton from '../components/logout'
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

interface ExtratoProps {
  user: {
    id: number
    fullName: string
    balance: number
    account: string
    agency: string
  }
  transactions: Array<{
    id: number
    senderId: number
    receiverId: number
    name: string
    amount: number
    type: string
    status: string
    date: string
    isSent: boolean
  }>
}

export default function Extrato({ user, transactions }: ExtratoProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const translateStatus = (status: string, type: string, isSent: boolean) => {
    if (type === 'REFUND') {
      return isSent ? 'Estorno enviado' : 'Estorno recebido'
    }
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'completed':
        return 'Concluído'
      case 'refunded':
        return 'Estornado'
      default:
        return status
    }
  }

  const translateType = (type: string, status: string) => {
    if (type === 'REFUND') return 'Estorno'
    if (type === 'PIX' && status === 'refunded') return 'PIX (Estornado)'
    return type
  }

  return (
    <>
      <Head title="Extrato" />
      <div className="min-h-screen bg-gray-950 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => router.visit('/conta')}>
                  <HomeIcon className="w-12 h-12 text-rose-600 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-150 p-3" />
                </button>
                <div>
                  <h3 className="text-2xl font-bold text-white">{user.fullName.toUpperCase()}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Agência {user.agency} | Conta {user.account}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="/resources/imagens/logo-banco.png"
                  alt="Logo do banco"
                  className="w-24 h-16 object-contain"
                />
                <LogoutButton size="md" />
              </div>
            </div>
          </div>

          {/* Grid Principal - 2 colunas no desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Esquerda - Saldo */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="bg-rose-600 rounded-xl p-6 flex flex-col">
                  <h3 className="text-lg text-white font-bold">Saldo em Conta</h3>
                  <h2 className="text-4xl text-white font-bold mt-4">
                    {formatCurrency(user.balance)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Histórico */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">Histórico</h3>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-xl mb-4">
                  <MagnifyingGlassIcon className="w-6 h-6 text-rose-600" />
                  <input
                    type="text"
                    placeholder="Buscar transação..."
                    className="w-full bg-transparent px-3 py-1 text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
                {console.log(transactions, user)}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-600 scrollbar-track-gray-800">
                  {transactions.length === 0 ? (
                    <p className="text-center text-gray-400 py-12">Nenhuma transação encontrada</p>
                  ) : (
                    transactions.map((transaction) => {
                      const hora = transaction.date.split(' - ')[1]
                      const statusLabel = translateStatus(
                        transaction.status,
                        transaction.type,
                        transaction.isSent
                      )
                      const typeLabel = translateType(transaction.type, transaction.status)
                      const refundSign = transaction.type === 'REFUND'

                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-750 transition-all duration-150"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-white text-lg flex items-center gap-2">
                              {transaction.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2 items-center">
                              <span>{hora}</span>
                              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600/20 text-blue-400 font-medium border border-blue-600/30">
                                PIX
                              </span>
                              {transaction.type === 'REFUND' &&
                                transaction.status === 'completed' &&
                                transaction.senderId === user.id && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-600/20 text-red-300 font-medium border border-red-600/30">
                                    Estorno Enviado
                                  </span>
                                )}
                              {transaction.type === 'REFUND' &&
                                transaction.status === 'completed' &&
                                transaction.receiverId === user.id && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-600/20 text-green-400 font-medium border border-green-600/30">
                                    Estorno Recebido
                                  </span>
                                )}
                              {transaction.type === 'PIX' &&
                                transaction.status === 'refunded' &&
                                transaction.senderId === user.id && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-600/20 text-yellow-300 font-medium border border-yellow-600/30">
                                    Estornado
                                  </span>
                                )}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p
                              className={`font-bold text-xl ${
                                transaction.isSent ? 'text-red-400' : 'text-green-400'
                              }`}
                            >
                              {transaction.isSent ? '-' : '+'} {formatCurrency(transaction.amount)}
                            </p>
                            <button
                              className="text-sm text-white hover:text-gray-200 hover:underline mt-1"
                              onClick={() => router.visit(`/informacaopix/${transaction.id}`)}
                            >
                              Ver detalhes
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
