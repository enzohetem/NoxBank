import { router, usePage } from '@inertiajs/react'

export default function Example() {
  const page = usePage<{ user: { fullName: string } | null }>()
  const isAuthenticated = Boolean(page.props.user)
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid min-h-full place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-rose-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            Página não encontrada
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            Desculpe, a página que você está procurando não existe.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => router.visit(isAuthenticated ? '/conta' : '/login')}
              className="rounded-md bg-rose-600 px-3.5 py-2.5 text-md w-full font-semibold text-white shadow-xs hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              Voltar para a página inicial
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
