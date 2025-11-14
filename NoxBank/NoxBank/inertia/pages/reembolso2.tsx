import React from 'react'
import { Head, router } from '@inertiajs/react'

export default function Reembolso2() {
  return (
    <>
      <Head title="Reembolso concluído" />
      <div className="min-h-screen bg-sand-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="text-sm text-indigo-600"
              aria-label="Voltar"
              onClick={() => history.back()}
            >
              ←
            </button>
            <img
              src="/imagens/logo-banco.png"
              alt="Logo do banco"
              className="w-11 h-11 object-contain"
            />
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-semibold">Isabella Almeida Soares.</h1>
            <p className="text-sm text-gray-600 mt-2">
              Reembolso realizado com sucesso o valor de R$ 350,00 foi reembolsado para a conta de
              Isabella Almeida Soares. A transação foi concluída e o valor já está disponível na
              conta de destino.
            </p>

            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
              onClick={() => router.visit('/conta')}
            >
              SIM
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
