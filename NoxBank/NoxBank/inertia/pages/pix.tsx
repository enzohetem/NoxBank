import { Head, router, usePage } from '@inertiajs/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { xsrfHeader } from '../app/utils/csrf'
import LogoutButton from '../components/logout'

interface PixProps {
  user: {
    fullName: string
    balance: number
  }
}

export default function Pix({ user }: PixProps) {
  const [pixKey, setPixKey] = useState('')
  const [keyType, setKeyType] = useState<'cpf' | 'phone' | 'email' | 'random'>('cpf')
  const inputRef = useRef<HTMLInputElement>(null)
  const page = usePage<{ error?: string }>()
  const flashError = page.props.error

  useEffect(() => {
    if (flashError) {
      toast.error(flashError)
    }
  }, [flashError])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const validatePixKey = (key: string, type: string): { valid: boolean; message: string } => {
    const trimmedKey = key.trim()

    if (!trimmedKey) {
      return { valid: false, message: 'Por favor, insira uma chave PIX válida' }
    }

    switch (type) {
      case 'cpf':
        // Remove caracteres não numéricos
        const cpfNumbers = trimmedKey.replace(/\D/g, '')
        if (cpfNumbers.length !== 11) {
          return { valid: false, message: 'CPF deve conter 11 dígitos' }
        }
        break

      case 'phone':
        // Remove caracteres não numéricos
        const phoneNumbers = trimmedKey.replace(/\D/g, '')
        if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
          return { valid: false, message: 'Telefone deve conter 10 ou 11 dígitos (com DDD)' }
        }
        break

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(trimmedKey)) {
          return { valid: false, message: 'Email inválido. Verifique o formato' }
        }
        break

      case 'random':
        // Chave aleatória geralmente é UUID ou string de 32+ caracteres
        if (trimmedKey.length < 20) {
          return {
            valid: false,
            message: 'Chave aleatória muito curta. Verifique se copiou corretamente',
          }
        }
        break
    }

    return { valid: true, message: '' }
  }

  const scrollToInput = () => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 300)
    }
  }

  const handleContinue = () => {
    const validation = validatePixKey(pixKey, keyType)

    if (!validation.valid) {
      toast.error(validation.message)
      scrollToInput()
      return
    }

    // Navega para próxima etapa passando a chave
    // O backend irá validar se a chave existe
    router.post(
      '/pixvalor',
      {
        identifier: pixKey,
      },
      {
        headers: xsrfHeader(),
      }
    )
  }

  return (
    <>
      <Head title="Transferência PIX" />
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
                  <h3 className="text-2xl font-bold text-white">Transferência PIX</h3>
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
            {/* Coluna Esquerda - Instruções */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <img src="/resources/imagens/pixx.png" alt="Ícone Pix" className="w-20 h-20" />
                </div>
                <h3 className="text-lg font-bold text-white text-center mb-2">
                  Como fazer um PIX?
                </h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">1.</span>
                    <span>Escolha o tipo de chave PIX</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">2.</span>
                    <span>Digite a chave do destinatário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">3.</span>
                    <span>Confirme os dados e o valor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">4.</span>
                    <span>Finalize a transferência</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Coluna Direita - Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Insira os dados do destinatário
                </h2>

                {/* Seletor de Tipo de Chave */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Tipo de chave PIX
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      onClick={() => setKeyType('cpf')}
                      className={`p-4 rounded-xl border-2 transition-all duration-150 ${
                        keyType === 'cpf'
                          ? 'border-rose-600 bg-rose-600/10 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold text-sm">CPF</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setKeyType('phone')}
                      className={`p-4 rounded-xl border-2 transition-all duration-150 ${
                        keyType === 'phone'
                          ? 'border-rose-600 bg-rose-600/10 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold text-sm">Telefone</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setKeyType('email')}
                      className={`p-4 rounded-xl border-2 transition-all duration-150 ${
                        keyType === 'email'
                          ? 'border-rose-600 bg-rose-600/10 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold text-sm">Email</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setKeyType('random')}
                      className={`p-4 rounded-xl border-2 transition-all duration-150 ${
                        keyType === 'random'
                          ? 'border-rose-600 bg-rose-600/10 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold text-sm">Aleatória</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Campo de Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chave PIX do destinatário
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder={
                      keyType === 'cpf'
                        ? 'Digite o CPF (apenas números)'
                        : keyType === 'phone'
                          ? 'Digite o telefone com DDD'
                          : keyType === 'email'
                            ? 'Digite o email completo'
                            : 'Cole a chave aleatória'
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all duration-150"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Certifique-se de que a chave está correta antes de continuar
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4">
                  <button
                    onClick={() => router.visit('/conta')}
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
