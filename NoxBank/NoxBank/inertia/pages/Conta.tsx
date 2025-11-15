import { Head, router } from '@inertiajs/react'
import LogoutButton from '../components/logout'

interface ContaProps {
  user: {
    fullName: string
    balance: number
    account: string
    agency: string
    email: string
    cpf: string
    phone: string
  }
}

export default function Conta({ user }: ContaProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <>
      <Head title="Conta" />
      <div className="min-h-screen bg-gray-950 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mt-1">Olá, boas-vindas ao NoxBank!</p>
                <h3 className="text-2xl font-bold font-inter text-white">
                  {user.fullName.toUpperCase()}
                </h3>
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

          {/* Grid Principal - 2 colunas no desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              {/* Card de Saldo */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <div className="bg-rose-600 rounded-xl p-6 flex flex-col">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg text-white font-bold">Saldo em Conta</h3>
                    <button
                      className="text-sm text-white font-bold hover:bg-gray-800 bg-gray-900 rounded-lg px-4 py-2 transition-all duration-150"
                      onClick={() => router.visit('/extrato')}
                    >
                      Extrato &gt;
                    </button>
                  </div>
                  <h2 className="text-4xl text-white font-bold mt-4">
                    {formatCurrency(user.balance)}
                  </h2>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    className="bg-gray-800 hover:bg-gray-700 transition-all duration-150 text-white flex flex-col items-center p-4 rounded-xl shadow"
                    onClick={() => router.visit('/pix')}
                  >
                    <img src="/resources/imagens/pixx.png" className="w-10 h-10 mb-3" alt="Pix" />
                    <span className="text-sm font-medium">Pix</span>
                  </button>
                  <div className="flex flex-col bg-gray-800 text-white hover:bg-gray-700 transition-all duration-150 items-center p-4 rounded-xl shadow">
                    <img
                      src="/resources/imagens/transação.png"
                      className="w-10 h-10 mb-3"
                      alt="Transferência"
                    />
                    <span className="text-sm font-medium">Transferência</span>
                  </div>
                  <div className="flex flex-col items-center bg-gray-800 text-white hover:bg-gray-700 transition-all duration-150 p-4 rounded-xl shadow">
                    <img
                      src="/resources/imagens/boleto.png"
                      className="w-10 h-10 mb-3"
                      alt="Boleto"
                    />
                    <span className="text-sm font-medium">Pagar boleto</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              {/* Cartão de Crédito */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <button
                  className="w-full items-start flex flex-col text-left hover:bg-gray-800 transition-all duration-150 p-4 rounded-xl"
                  onClick={() => router.visit('/extrato')}
                >
                  <p className="text-white text-2xl font-bold">Cartão de crédito</p>
                  <p className="text-sm text-gray-400 mt-2">Fatura atual</p>
                  {/* Valores ainda estáticos; substituir quando houver modelo de cartão */}
                  <p className="text-3xl font-bold mt-4 text-white">R$ 0,00</p>
                  <p className="text-sm text-gray-400 mt-2">Limite disponível de R$ 0,00</p>
                </button>
              </div>

              {/* Informações da Conta */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Informações da Conta</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nome completo</span>
                    <span className="text-white font-medium">{user.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email</span>
                    <span className="text-white font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CPF</span>
                    <span className="text-white font-medium">{`${user.cpf.slice(0, 3)}.***.***-**${user.cpf.slice(-2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Telefone</span>
                    <span className="text-white font-medium">{`${user.phone.slice(0, 3)}.***.***-**${user.phone.slice(-2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Agência</span>
                    <span className="text-white font-medium">{user.agency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conta</span>
                    <span className="text-white font-medium">{user.account}</span>
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
