import React from 'react'
import { Head, router } from '@inertiajs/react'
import { BellAlertIcon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function PixAtencao() {
  return (
    <>
      <Head title="Atenção - PIX" />
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-950 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <button
              aria-label="Voltar"
              onClick={() => router.visit('/conta')}
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

          <div className="mt-4">
            <BellAlertIcon className="w-12 h-12 text-rose-600 mt-10 mx-auto mb-4" />
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">Atenção</h2>
              <h3 className="text-sl font-semibold mb-2 text-gray-300">Evite Golpes</h3>
              <p className="text-md pt-10 pr-10 pl-10 text-justify text-white">
                Você está prestes a enviar um PIX para <strong>ISABELLA ALMEIDA SOARES</strong> no
                valor de
                <strong> R$ 350,00</strong>.
              </p>
              <p className="text-md pr-10 pl-10 pb-5 pt-2 text-justify text-white">
                Você recebeu um saldo recentemente nesse valor, isso é um estorno? Se "sim" cancele
                a transação e utilize a ferramenta de estornar o saldo ao remetente, se for um PIX
                convencional apenas continue.
              </p>
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md transition-all duration-150 hover:bg-gray-300"
                onClick={() => router.visit('/pix')}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-rose-600 text-white rounded-md transition-all duration-150 hover:bg-rose-700"
                onClick={() => router.visit('/enviado')}
              >
                Realizar PIX
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
