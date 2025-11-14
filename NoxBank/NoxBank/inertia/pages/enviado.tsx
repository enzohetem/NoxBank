import React from 'react'
import { Head, router } from '@inertiajs/react'
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function Enviado() {
  return (
    <>
      <Head title="PIX Enviado" />
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-950 rounded-2xl p-6 shadow-lg text-center">
          <img
            src="/resources/imagens/logo-banco.png"
            alt="Logo do banco"
            className="w-40 h-40 object-contain mx-auto mb-4"
          />

          <div className="mt-2">
            <h1 className="text-lg font-semibold text-white">
              Transferência realizada com sucesso
            </h1>
            <p className="text-sm text-white mt-5">
              O valor de <strong>R$ 350,00</strong> foi enviado para a conta de{' '}
              <strong>Isabella Almeida Soares.</strong>
            </p>
            <p className="text-sm mt-20 mb-3 text-gray-300">
              A transação foi concluída e o valor já está disponível na conta de destino.
            </p>

            <button
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md font-bold hover:bg-rose-700 w-full"
              onClick={() => router.visit('/conta')}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
