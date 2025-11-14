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
    router.get('/pixvalor', [PixController, 'showValor']).as('pix.valor')
    router.post('/pix/validate', [PixController, 'validate']).as('pix.validate')
    router.post('/pix', [PixController, 'store']).as('pix.store')
    router.post('/pix/refund', [PixController, 'refund']).as('pix.refund')

    // Páginas intermediárias do PIX (usam rotas simples pois só exibem UI)
    router.on('/pixatencao').renderInertia('pixatencao')
    router.on('/pixconfirmar').renderInertia('pixconfirmar')
    router.on('/enviado').renderInertia('enviado')

    // Transações / Extrato
    router.get('/extrato', [TransactionController, 'index']).as('extrato')
    router.get('/informacaopix/:id', [TransactionController, 'show']).as('transaction.show')

    // Reembolso
    router.on('/reembolso1').renderInertia('reembolso1')
    router.on('/reembolso2').renderInertia('reembolso2')
  })
  .use(middleware.auth())
