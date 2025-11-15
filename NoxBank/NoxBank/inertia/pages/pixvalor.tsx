import { Head, router } from '@inertiajs/react'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { xsrfHeader } from '../app/utils/csrf'
import LogoutButton from '../components/logout'

interface PixValorProps {
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
}

export default function PixValor({ user, receiver }: PixValorProps) {
  const [amount, setAmount] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const parseAmount = (value: string): number => {
    // Remove tudo exceto números e vírgula
    const cleaned = value.replace(/[^\d,]/g, '')
    // Substitui vírgula por ponto
    const normalized = cleaned.replace(',', '.')
    return parseFloat(normalized) || 0
  }

  const formatAmountInput = (value: string) => {
    // Remove tudo exceto números e vírgula
    let cleaned = value.replace(/[^\d,]/g, '')

    // Garante apenas uma vírgula
    const parts = cleaned.split(',')
    if (parts.length > 2) {
      cleaned = parts[0] + ',' + parts.slice(1).join('')
    }

    // Limita casas decimais a 2
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + ',' + parts[1].substring(0, 2)
    }

    return cleaned
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmountInput(e.target.value)
    setAmount(formatted)
  }

  const validateAmount = (): { valid: boolean; message: string } => {
    const parsedAmount = parseAmount(amount)

    if (!amount || parsedAmount <= 0) {
      return { valid: false, message: 'Por favor, insira um valor válido' }
    }

    if (parsedAmount > user.balance) {
      return {
        valid: false,
        message: `Saldo insuficiente. Seu saldo atual é ${formatCurrency(user.balance)}`,
      }
    }

    if (parsedAmount > 10000) {
      return {
        valid: false,
        message: 'O valor máximo por transação é R$ 10.000,00',
      }
    }

    return { valid: true, message: '' }
  }

  const handleContinue = () => {
    const validation = validateAmount()

    if (!validation.valid) {
      toast.error(validation.message)
      inputRef.current?.focus()
      return
    }

    const parsedAmount = parseAmount(amount)

    // Envia validação com os dados - backend redireciona automaticamente para pixatencao ou pixconfirmar
    router.post(
      '/pix/validate',
      {
        receiverId: receiver.id,
        amount: parsedAmount,
        receiverPixKey: receiver.pixKey,
      },
      {
        preserveScroll: true,
        headers: xsrfHeader(),
        onError: (errors: any) => {
          toast.error(errors.error || 'Erro ao validar transferência')
        },
      }
    )
  }

  return (
    <>
      <Head title="Valor da Transferência PIX" />
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
                  <h3 className="text-2xl font-bold text-white">Valor da Transferência</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Enviando como {user.fullName} • Saldo: {formatCurrency(Number(user.balance))}
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
            {/* Coluna Esquerda - Informações do Destinatário */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <img src="/resources/imagens/pixx.png" alt="Ícone Pix" className="w-20 h-20" />
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-4">Transferindo para</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Nome</p>
                    <p className="text-sm font-bold text-white">{receiver.fullName}</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">CPF</p>
                    <p className="text-sm font-bold text-white">{formatCPF(receiver.cpf)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Chave PIX</p>
                    <p className="text-sm font-bold text-white break-all">{receiver.pixKey}</p>
                  </div>
                </div>
              </div>

              {/* Dicas */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white mb-3">💡 Dicas importantes</h4>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>• Verifique os dados do destinatário</li>
                  <li>• Confirme o valor antes de prosseguir</li>
                  <li>• O valor será debitado imediatamente</li>
                  <li>• Limite máximo: R$ 10.000,00</li>
                </ul>
              </div>
            </div>

            {/* Coluna Direita - Formulário de Valor */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
                <button
                  onClick={() => router.visit('/pix')}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="text-sm">Voltar para seleção de chave</span>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Quanto você quer transferir?</h2>

                {/* Input de Valor */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Valor da transferência
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-gray-400">
                      R$
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0,00"
                      className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl pl-16 pr-4 py-6 text-3xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all duration-150"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">Use vírgula para centavos (ex: 100,50)</p>
                    <p className="text-xs text-gray-400">
                      Disponível:{' '}
                      <span className="font-bold text-white">{formatCurrency(user.balance)}</span>
                    </p>
                  </div>
                </div>

                {/* Valores Sugeridos */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-300 mb-3">Valores rápidos</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[10, 20, 50, 100].map((value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value.toString())}
                        className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-rose-600 rounded-xl text-white font-bold transition-all duration-150"
                      >
                        R$ {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resumo da Transação */}
                {amount && parseAmount(amount) > 0 && (
                  <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Você está enviando</span>
                      <span className="text-xl font-bold text-white">
                        {formatCurrency(parseAmount(amount))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Saldo após transferência</span>
                      <span className="text-lg font-bold text-rose-600">
                        {formatCurrency(user.balance - parseAmount(amount))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-4">
                  <button
                    onClick={() => router.visit('/pix')}
                    className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-150"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all duration-150 shadow-lg shadow-rose-600/20"
                  >
                    Continuar
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
