import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

export default class AuthController {
  /**
   * Exibe a página de login
   */
  async showLogin({ inertia, auth, response }: HttpContext) {
    // Se já está autenticado, redireciona para conta
    if (await auth.check()) {
      return response.redirect('/conta')
    }
    return inertia.render('auth/login')
  }

  /**
   * Processa o login do usuário
   */
  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    logger.info(`Tentativa de login: ${email}`)

    try {
      const user = await User.verifyCredentials(email, password)
      logger.info(`Usuário verificado: ${user.email}`)

      await auth.use('web').login(user)
      logger.info(`Usuário logado com sucesso: ${user.email}`)

      // Força redirect externo para recarregar com auth
      return response.redirect().toRoute('conta')
    } catch (error) {
      logger.error(`Erro no login: ${error.message}`)
      session.flash('error', 'Credenciais inválidas')
      return response.redirect().back()
    }
  }

  /**
   * Desloga o usuário
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
