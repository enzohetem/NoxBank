import React from 'react'
import { Head, router } from '@inertiajs/react'
import axios from 'axios'
import { BellAlertIcon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function PixConfirmar() {
  return (
    <>
      <Head title="Confirmar PIX" />
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-950 rounded-2xl p-6 shadow-lg text-center">
          <div className="flex items-center justify-between mb-4">
            <button aria-label="Voltar" onClick={() => router.visit('/conta')} className="text-lg">
              <HomeIcon className="w-12 h-12 text-rose-600 bg-gray-950 rounded-full hover:bg-gray-800 animation: transition-all duration-150 p-3" />
            </button>

            <img
              src="/resources/imagens/logo-banco.png"
              alt="Logo do banco"
              className="w-md h-12 object-contain"
            />
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-bold text-white">Isabella Almeida Soares.</h1>
            <p className="text-md text-gray-300 font-semibold mt-2">
              Você deseja enviar para Isabella Almeida Soares R$ 350,00?
            </p>

            <div className="flex gap-3 justify-center mt-6">
              <button
                className="mt-4 px-4 py-2 bg-gray-200 rounded-md transition-all duration-150 hover:bg-gray-300"
                onClick={() => router.visit('/pix')}
              >
                Cancelar
              </button>
              <button
                className="mt-4 px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 animation: transition-all duration-150 rounded-md"
                onClick={() => router.visit('/enviado')}
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
