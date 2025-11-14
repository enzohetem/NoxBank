import React from 'react'
import { Head, router } from '@inertiajs/react'
import { HomeIcon } from '@heroicons/react/24/solid'

export default function InformacaoPix() {
  return (
    <>
      <Head title="Dados do PIX" />

      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-950 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <button
              aria-label="Voltar"
              onClick={() => router.visit('/extrato')}
              className="text-lg"
            >
              <HomeIcon className="w-12 h-12 text-rose-600 bg-gray-950 rounded-full hover:bg-gray-800 animation: transition-all duration-150 p-3" />
            </button>

            <img
              src="/resources/imagens/logo-banco.png"
              alt="Logo do banco"
              className="w-md h-12 object-contain"
            />
          </div>

          <div className="text-center mb-4">
            <h1 className="text-sm font-semibold text-gray-300">Pix realizado para</h1>
            <h1 className="text-2xl font-bold text-white">Isabella Almeida Soares</h1>
            <p className="text-2xl font-bold text-white mt-1">R$ 350,00</p>
            <time className="text-sm text-gray-300">07 OUT 2025 - 19:36:22</time>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-sm text-gray-300">Transferência recebida</span>
              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-xs font-semibold">
                PIX
              </span>
            </div>
          </div>

          <nav className="flex justify-between gap-3 mb-6">
            <button
              className="flex-1 flex flex-col items-center gap-2 bg-gray-900 hover:bg-gray-800 transition-all duration-150 text-base text-white rounded-lg p-3"
              onClick={() => router.visit('/comprovante')}
              aria-label="Comprovante"
            >
              <img src="/resources/imagens/comprovante.png" alt="Comprovante" className="w-8 h-8" />
              <span className="text-sm">Comprovante</span>
            </button>

            <button
              className="flex-1 flex flex-col items-center gap-2 bg-gray-900 hover:bg-gray-800 transition-all duration-150 text-base text-white rounded-lg p-3"
              onClick={() => router.visit('/reembolso1')}
              aria-label="Estorno"
            >
              <img src="/resources/imagens/estorno.png" alt="Estorno" className="w-8 h-8" />
              <span className="text-sm">Estorno</span>
            </button>

            <button
              className="flex-1 flex flex-col items-center gap-2 bg-gray-900 hover:bg-gray-800 transition-all duration-150 text-base text-white rounded-lg p-3"
              onClick={() => router.visit('/score')}
              aria-label="Score"
            >
              <img src="/resources/imagens/score.png" alt="Score" className="w-8 h-8" />
              <span className="text-sm">Score</span>
            </button>
          </nav>

          <section className="space-y-4">
            <div>
              <span className="text-sm text-gray-300">Nome</span>
              <p className="font-medium text-white">Isabella Almeida Soares</p>
            </div>
            <div className="border-t border-gray-200" />

            <div>
              <span className="text-sm text-gray-500">Nome original</span>
              <p className="font-medium text-white">ISABELLA ALMEIDA SOARES</p>
            </div>
            <div className="border-t border-gray-200" />

            <div>
              <span className="text-sm text-gray-500">Instituição</span>
              <p className="font-medium text-white">BCO BRADESCO S.A.</p>
            </div>
            <div className="border-t border-gray-200" />

            <div>
              <span className="text-sm text-gray-500">Categoria</span>
              <p className="font-medium text-white">Transferência</p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
