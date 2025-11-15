/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const PixController = () => import('#controllers/pix_controller')
const TransactionController = () => import('#controllers/transaction_controller')

import { middleware } from '#start/kernel'

// Rota raiz - redireciona para login se não autenticado
router.get('/', async ({ auth, response }) => {
  if (await auth.check()) {
    return response.redirect('conta')
  }
  return response.redirect('/login')
})

// Rotas públicas
router.get('/login', [AuthController, 'showLogin']).as('login.show')
router.post('/login', [AuthController, 'login']).as('login')
router.get('/logout', [AuthController, 'logout']).as('logout')

// Rotas protegidas (requer autenticação)
router
  .group(() => {
    // Conta do usuário
    router.get('/conta', [PixController, 'showAccount']).as('conta')

    // PIX
    router.get('/pix', [PixController, 'create']).as('pix.create')
    router.post('/pixvalor', [PixController, 'showValor']).as('pix.valor')
    router.post('/pix/validate', [PixController, 'validate']).as('pix.validate')
    router.get('/pixatencao', [PixController, 'showAtencao']).as('pix.atencao')
    router.get('/pixconfirmar', [PixController, 'showConfirmar']).as('pix.confirmar')
    router.post('/pix/transfer', [PixController, 'store']).as('pix.store')
    router.post('/pix/refund', [PixController, 'refund']).as('pix.refund')
    router.get('/estorno', [PixController, 'showRefundPage']).as('pix.estorno')

    // Página de sucesso
    router.get('/enviado', [PixController, 'showEnviado']).as('pix.enviado')

    // Transações / Extrato
    router.get('/extrato', [TransactionController, 'index']).as('extrato')
    router.get('/informacaopix/:id', [TransactionController, 'show']).as('transaction.show')

    // (Rotas antigas de reembolso removidas)
  })
  .use(middleware.auth())

// Fallback: qualquer rota não mapeada → página 404 Inertia
router.any('*', async ({ inertia, response }) => {
  response.status(404)
  return inertia.render('errors/notfound')
})
