import { Head, router } from '@inertiajs/react'
import LogoutButton from '../components/logout'
import {
  HomeIcon,
  ReceiptRefundIcon,
  DocumentCheckIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/solid'

interface InformacaoPixProps {
  transaction: {
    id: number
    name: string
    cpf: string
    amount: number
    type: string
    status: string
    date: string
    isSent: boolean
    canRefund: boolean
  }
}

export default function InformacaoPix({ transaction }: InformacaoPixProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <>
      <Head title="Dados do PIX" />
      <div className="min-h-screen bg-gray-950 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => router.visit('/extrato')}>
                  <HomeIcon className="w-12 h-12 text-rose-600 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-150 p-3" />
                </button>
                <div>
                  <h3 className="text-2xl font-bold text-white">Detalhes da Transação</h3>
                  <p className="text-sm text-gray-400 mt-1">Informações completas do PIX</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="/resources/imagens/logo-banco.png"
                  className="w-24 h-16 object-contain"
                  alt="logo"
                />
                <LogoutButton size="md" />
              </div>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Esquerda - Informações Principais */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-400">
                    {transaction.isSent ? 'Pix realizado para' : 'Pix recebido de'}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">{transaction.name}</h2>
                  <p
                    className={`text-3xl font-bold mt-4 ${
                      transaction.isSent ? 'text-red-400' : 'text-green-500'
                    }`}
                  >
                    {transaction.isSent ? '-' : '+'} {formatCurrency(transaction.amount)}
                  </p>
                  <time className="text-sm text-gray-400 mt-2 block">{transaction.date}</time>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-sm text-gray-300">{transaction.status}</span>
                  <span className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold">
                    {transaction.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Detalhes e Ações */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Informações da Transação</h2>

                {/* Botões de Ação */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <button
                    className="flex flex-col items-center gap-3 bg-gray-800 hover:bg-gray-700 transition-all duration-150 text-white rounded-xl p-6"
                    onClick={() => router.visit(`/informacaopix/${transaction.id}`)}
                    aria-label="Comprovante"
                  >
                    <DocumentCheckIcon className="w-24 h-20 text-rose-600 p-3" />
                    <span className="text-sm font-medium">Comprovante</span>
                  </button>

                  {transaction.canRefund && (
                    <button
                      className="flex flex-col items-center gap-3 bg-gray-800 hover:bg-gray-700 transition-all duration-150 text-white rounded-xl p-6"
                      onClick={() => router.visit(`/estorno?transactionId=${transaction.id}`)}
                      aria-label="Estorno"
                    >
                      <ReceiptRefundIcon className="w-24 h-20 text-rose-600 p-3" />

                      <span className="text-sm font-medium">Estorno</span>
                    </button>
                  )}

                  <button
                    className="flex flex-col items-center gap-3 bg-gray-800 hover:bg-gray-700 transition-all duration-150 text-white rounded-xl p-6"
                    onClick={() => router.visit('/notfound')}
                    aria-label="Score"
                  >
                    <PresentationChartLineIcon className="w-24 h-20 text-rose-600 p-3" />
                    <span className="text-sm font-medium">Score</span>
                  </button>
                </div>

                {/* Detalhes da Transação */}
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <span className="text-sm text-gray-400 block mb-1">Nome</span>
                    <p className="font-semibold text-white text-lg">{transaction.name}</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4">
                    <span className="text-sm text-gray-400 block mb-1">Nome original</span>
                    <p className="font-semibold text-white text-lg">
                      {transaction.name.toUpperCase()}
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4">
                    <span className="text-sm text-gray-400 block mb-1">CPF</span>
                    <p className="font-semibold text-white text-lg">{transaction.cpf}</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4">
                    <span className="text-sm text-gray-400 block mb-1">Categoria</span>
                    <p className="font-semibold text-white text-lg">{transaction.type}</p>
                  </div>
                </div>

                {/* Botão Voltar */}
                <div className="mt-8">
                  <button
                    onClick={() => router.visit('/extrato')}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all duration-150 shadow-lg shadow-rose-600/20"
                  >
                    Voltar ao Extrato
                  </button>
                </div>

                {/* Informação de Segurança */}
                <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400 text-center">
                    🔒 Suas transações são protegidas com criptografia de ponta a ponta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
