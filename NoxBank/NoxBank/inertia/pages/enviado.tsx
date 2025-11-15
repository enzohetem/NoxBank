import React from 'react'
import { Head, router } from '@inertiajs/react'
import { HomeIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import LogoutButton from '../components/logout'

interface EnviadoProps {
  user: {
    fullName: string
    balance: number
  }
  transaction: {
    receiverFullName: string
    amount: number
  }
}

export default function Enviado({ user, transaction }: EnviadoProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = () => {
    const now = new Date()
    return (
      now
        .toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .toUpperCase() +
      ' - ' +
      now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    )
  }

  return (
    <>
      <Head title="PIX Enviado" />
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
                  <h3 className="text-2xl font-bold text-white">PIX Enviado com Sucesso</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {user.fullName} • Saldo: {formatCurrency(Number(user.balance))}
                  </p>
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
            {/* Coluna Esquerda - Ícone de Sucesso */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col items-center justify-center text-center">
                  <CheckCircleIcon className="w-32 h-32 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Transferência Concluída!</h3>
                  <p className="text-sm text-gray-400">
                    O valor já está disponível na conta do destinatário
                  </p>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Detalhes da Transação */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Detalhes da Transferência</h2>

                {/* Informações da Transação */}
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">Valor enviado</span>
                      <span className="text-3xl font-bold text-green-500">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Para</span>
                        <span className="text-lg font-semibold text-white">
                          {transaction.receiverFullName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Data e hora</span>
                        <span className="text-sm text-gray-300">{formatDate()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mensagem Informativa */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-sm text-green-400 text-center">
                      ✅ A transação foi concluída e o valor já está disponível na conta de destino.
                    </p>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-col lg:flex-row gap-4 mt-6">
                    <button
                      onClick={() => router.visit('/extrato')}
                      className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-150"
                    >
                      Ver Extrato
                    </button>
                    <button
                      onClick={() => router.visit('/pix')}
                      className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-150"
                    >
                      Nova Transferência
                    </button>
                    <button
                      onClick={() => router.visit('/conta')}
                      className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all duration-150 shadow-lg shadow-rose-600/20"
                    >
                      Voltar ao Início
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
      </div>
    </>
  )
}
