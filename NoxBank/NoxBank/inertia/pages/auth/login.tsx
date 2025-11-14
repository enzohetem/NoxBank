import React, { useEffect, useRef, useState } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import Toast from '../../components/Toast'

export default function Login() {
  const { data, setData, post, processing } = useForm({
    email: '',
    password: '',
  })
  const [showError, setShowError] = useState(false)
  const [toastKey, setToastKey] = useState(0)
  const TOAST_DURATION = 4200
  const page = usePage<{ error?: string }>()
  const flashError = page.props.error
  const hideTimer = useRef<number | null>(null)

  const showErrorToast = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    setToastKey((k) => k + 1) // força remontagem do Toast e reinicia a animação
    setShowError(true)
    hideTimer.current = window.setTimeout(() => setShowError(false), TOAST_DURATION)
  }

  useEffect(() => {
    if (flashError) {
      // Limpa a senha quando houver erro vindo do servidor (ex: credenciais inválidas)
      setData('password', '')
      showErrorToast()
    }
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [flashError])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setShowError(false)

    post('/login', {
      onError: () => {
        // Limpa a senha quando a submissão falhar (ex: validação 422)
        setData('password', '')
        showErrorToast()
      },
    })
  }

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen flex items-center justify-center bg-slate-800 p-6">
        <div className="w-full max-w-md rounded-3xl bg-gray-950 shadow-lg p-6 relative">
          <Toast
            key={toastKey}
            show={showError}
            type="error"
            message={flashError || 'Falha no login. Verifique suas credenciais.'}
            duration={TOAST_DURATION}
            progressDirection="ltr"
            onClose={() => setShowError(false)}
          />

          <img
            className="mx-auto mb-6 w-36 h-28 object-contain rounded-none"
            src="/resources/imagens/logo-banco.png"
            alt="Logo do banco"
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-l font-bold text-rose-600">Email</h1>
            <div className="relative">
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <h1 className="text-l font-bold text-rose-600">Senha</h1>
            <div className="relative">
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Senha"
                required
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-50 transition-all"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>ACESSANDO...</span>
                </div>
              ) : (
                'ACESSAR'
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            <p>O banco das Lendas</p>
          </div>

          <img
            src="/resources/imagens/informacao.png"
            alt="Informações"
            className="absolute left-4 bottom-4 w-7 h-7"
          />
          <img
            src="/resources/imagens/suporte.png"
            alt="Suporte"
            className="absolute right-4 bottom-4 w-7 h-7"
          />
        </div>
      </div>
    </>
  )
}
