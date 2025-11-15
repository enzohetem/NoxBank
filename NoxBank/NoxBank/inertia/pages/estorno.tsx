import React, { useEffect } from 'react'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import {
  HomeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import LogoutButton from '../components/logout'
import { toast } from 'react-toastify'
import { xsrfHeader } from '../app/utils/csrf'

interface EstornoProps {
  user: { fullName: string; balance: number }
  eligible: null | {
    id: number
    name: string
    amount: number
    date: string
    alreadyRefunded: boolean
  }
  message: string | null
}

export default function Estorno({ user, eligible, message }: EstornoProps) {
  const page = usePage<{ success?: string; error?: string }>()
  const { data, post, processing, reset } = useForm<{ transactionId: number | null }>({
    transactionId: eligible?.id || null,
  })

  useEffect(() => {
    if (page.props.success) toast.success(String(page.props.success))
    if (page.props.error) toast.error(String(page.props.error))
  }, [page.props.success, page.props.error])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const handleRefund = () => {
    if (!eligible || eligible.alreadyRefunded || !data.transactionId) return
    post('/pix/refund', {
      headers: xsrfHeader(),
      preserveScroll: true,
      onSuccess: () => {
        reset()
      },
    })
  }

  return (
    <>
      <Head title="Estorno Seguro" />
      <div className="min-h-screen bg-gray-950 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => router.visit('/conta')}>
                  <HomeIcon className="w-12 h-12 text-rose-600 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-150 p-3" />
                </button>
                <div>
                  <h3 className="text-2xl font-bold text-white">Estorno Seguro</h3>
                  <p className="text-sm text-gray-400 mt-1">{user.fullName}</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lado esquerdo - Ajuda/segurança */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h4 className="text-white font-bold mb-3">Como funciona o estorno?</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Disponível apenas para PIX recebido.</li>
                  <li>• Só pode ser feito uma única vez.</li>
                  <li>• Valor e destinatário devem ser os mesmos.</li>
                  <li>• Saldo suficiente é necessário para estornar.</li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-xs text-gray-400 text-center">
                  🔒 Transações protegidas por criptografia de ponta a ponta
                </p>
              </div>
            </div>

            {/* Lado direito - Conteúdo principal */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="text-sm">Voltar</span>
                </button>

                {!eligible && (
                  <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2 text-yellow-300">
                      <ExclamationTriangleIcon className="w-6 h-6" />
                      <h2 className="text-lg font-bold">Nenhuma transação elegível</h2>
                    </div>
                    <p className="text-sm text-gray-300">
                      {message || 'Tente novamente pelo extrato.'}
                    </p>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => router.visit('/extrato')}
                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-150"
                      >
                        Ir ao Extrato
                      </button>
                      <button
                        onClick={() => router.visit('/conta')}
                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all duration-150"
                      >
                        Voltar à Conta
                      </button>
                    </div>
                  </div>
                )}

                {eligible && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Confirmar estorno</h2>
                    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Destinatário do estorno</p>
                          <p className="text-sm font-bold text-white">{eligible.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Data do PIX recebido</p>
                          <p className="text-sm font-bold text-white">{eligible.date}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Valor</p>
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(eligible.amount)}
                        </p>
                      </div>
                      {eligible.alreadyRefunded && (
                        <div className="flex items-center gap-2 text-green-400 bg-green-900/20 border border-green-700/30 p-3 rounded-lg">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="text-sm">Esta transação já foi estornada.</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={() => router.visit('/extrato')}
                        className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-150"
                        disabled={processing}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleRefund}
                        disabled={processing || eligible.alreadyRefunded}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all duration-150 shadow-lg ${
                          processing || eligible.alreadyRefunded
                            ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                        }`}
                      >
                        {eligible.alreadyRefunded
                          ? 'Já estornado'
                          : processing
                            ? 'Estornando…'
                            : 'Confirmar estorno'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
