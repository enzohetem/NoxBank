import { Head, router, useForm } from '@inertiajs/react'
import { HomeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-toastify'
import { xsrfHeader } from '../app/utils/csrf'
import LogoutButton from '../components/logout'

interface PixConfirmarProps {
  user: {
    fullName: string
    balance: number
  }
  receiver: {
    id: number
    fullName: string
    cpf: string
    pixKey: string
  }
  amount: number
}

export default function PixConfirmar({ user, receiver, amount }: PixConfirmarProps) {
  const { post, processing } = useForm({
    receiverId: receiver.id,
    amount: amount,
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleConfirm = () => {
    // Backend redireciona automaticamente para /enviado após sucesso
    post('/pix/transfer', {
      headers: xsrfHeader(),
      onError: (errors: any) => {
        toast.error(errors.error || errors.message || 'Erro ao realizar transferência')
      },
    })
  }

  return (
    <>
      <Head title="Confirmar Transferência PIX" />
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
                  <h3 className="text-2xl font-bold text-white">Confirmar Transferência</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Revise os dados antes de finalizar • Saldo:{' '}
                    {formatCurrency(Number(user.balance))}
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
            {/* Coluna Esquerda - Resumo da Transação */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircleIcon className="w-20 h-20 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-4">
                  Pronto para transferir
                </h3>
                <div className="bg-gray-800 rounded-xl p-4 text-center mb-4">
                  <p className="text-xs text-gray-400 mb-1">Valor total</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(amount)}</p>
                </div>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Seu saldo atual</span>
                    <span className="text-white font-bold">{formatCurrency(user.balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Após transferência</span>
                    <span className="text-rose-600 font-bold">
                      {formatCurrency(user.balance - amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informações de Segurança */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white mb-3">🔒 Segurança</h4>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>• Operação protegida por criptografia</li>
                  <li>• Dados verificados pelo sistema</li>
                  <li>• Transferência instantânea</li>
                  <li>• Comprovante disponível após envio</li>
                </ul>
              </div>
            </div>

            {/* Coluna Direita - Dados da Transferência */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="text-sm">Voltar e alterar valor</span>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Revise os dados</h2>

                {/* Dados do Destinatário */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Destinatário</h3>
                  <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nome completo</p>
                      <p className="text-lg font-bold text-white">{receiver.fullName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">CPF</p>
                        <p className="text-sm font-bold text-white">{formatCPF(receiver.cpf)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Instituição</p>
                        <p className="text-sm font-bold text-white">NoxBank</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chave PIX utilizada</p>
                      <p className="text-sm font-bold text-white break-all">{receiver.pixKey}</p>
                    </div>
                  </div>
                </div>

                {/* Dados do Remetente */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Remetente</h3>
                  <div className="bg-gray-800 rounded-xl p-5">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nome completo</p>
                      <p className="text-lg font-bold text-white">{user.fullName}</p>
                    </div>
                  </div>
                </div>

                {/* Detalhes da Operação */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Detalhes da operação</h3>
                  <div className="bg-gray-800 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Tipo de transferência</span>
                      <span className="text-sm font-bold text-white">PIX</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Valor</span>
                      <span className="text-lg font-bold text-white">{formatCurrency(amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Data/Hora</span>
                      <span className="text-sm font-bold text-white">
                        {new Date().toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aviso */}
                <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl">
                  <p className="text-sm text-yellow-200 text-center">
                    ⚠️ Atenção: Após confirmar, a operação não poderá ser cancelada
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4">
                  <button
                    onClick={() => router.visit('/pix')}
                    disabled={processing}
                    className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={processing}
                    className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all duration-150 shadow-lg shadow-rose-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processando...' : 'Confirmar Transferência'}
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
