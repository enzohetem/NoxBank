import { Head, router } from '@inertiajs/react'
import LogoutButton from '../components/logout'
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'

interface PixAtencaoProps {
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
  alertMessage: string
}

export default function PixAtencao({ user, receiver, amount, alertMessage }: PixAtencaoProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleContinue = () => {
    router.get('/pixconfirmar', {
      receiverId: receiver.id,
      amount: amount,
      receiverPixKey: receiver.pixKey,
    })
  }

  return (
    <>
      <Head title="Atenção - Possível Golpe" />
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
                  <h3 className="text-2xl font-bold text-white">⚠️ Alerta de Segurança</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Detectamos uma possível tentativa de golpe
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
            {/* Coluna Esquerda - Alerta */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-2xl p-6 shadow-lg border-2 border-red-600/50">
                <div className="flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="w-20 h-20 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-4">ATENÇÃO!</h3>
                <div className="bg-gray-900/60 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-300 mb-2">Valor da transferência</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(amount)}</p>
                </div>
              </div>

              {/* Como evitar golpes */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white mb-3">🛡️ Como se proteger</h4>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>• Use sempre a função de estorno</li>
                  <li>• Desconfie de urgência excessiva</li>
                  <li>• Verifique os dados do destinatário</li>
                  <li>• Nunca compartilhe senhas</li>
                  <li>• Em caso de dúvida, cancele</li>
                </ul>
              </div>
            </div>

            {/* Coluna Direita - Detalhes do Alerta */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="text-sm">Voltar e alterar valor</span>
                </button>

                <div className="mb-6 p-6 bg-red-900/20 border-2 border-red-600/50 rounded-xl">
                  <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-8 h-8" />
                    Evite Golpes!
                  </h2>
                  <p className="text-base text-gray-200 leading-relaxed mb-4">
                    {alertMessage || 'Detectamos um padrão suspeito nesta transação.'}
                  </p>
                </div>

                {/* Informações da Transação */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Detalhes da transferência</h3>
                  <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Destinatário</p>
                        <p className="text-sm font-bold text-white">{receiver.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">CPF</p>
                        <p className="text-sm font-bold text-white">{formatCPF(receiver.cpf)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chave PIX</p>
                      <p className="text-sm font-bold text-white break-all">{receiver.pixKey}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Valor</p>
                        <p className="text-lg font-bold text-red-400">{formatCurrency(amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Seu saldo após</p>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(user.balance - amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perguntas de Segurança */}
                <div className="mb-6 bg-gray-800 rounded-xl p-5">
                  <h3 className="text-base font-bold text-white mb-4">
                    Antes de continuar, responda:
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-300">
                        ❓ Você recebeu um valor semelhante recentemente?
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Se sim, pode ser uma tentativa de golpe de "estorno falso"
                      </p>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-300">
                        ❓ Alguém pediu que você devolvesse um valor?
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Use sempre a função oficial de estorno do banco
                      </p>
                    </div>
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-300">❓ Você conhece o destinatário?</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Verifique se os dados correspondem à pessoa que você conhece
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opção de Estorno */}
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700/30 rounded-xl">
                  <h4 className="text-sm font-bold text-blue-300 mb-2">
                    💡 Precisa devolver um valor recebido?
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Use nossa função de estorno seguro em vez de fazer um novo PIX
                  </p>
                  <button
                    onClick={() =>
                      router.visit(`/estorno?receiverId=${receiver.id}&amount=${amount}`)
                    }
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all duration-150"
                  >
                    Ir para Estorno Seguro
                  </button>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4">
                  <button
                    onClick={() => router.visit('/pix')}
                    className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-150"
                  >
                    Cancelar Transferência
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-150 shadow-lg shadow-red-600/20"
                  >
                    Continuar Mesmo Assim
                  </button>
                </div>

                {/* Aviso Final */}
                <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400 text-center">
                    ⚠️ O NoxBank nunca solicita transferências via telefone, WhatsApp ou email
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
