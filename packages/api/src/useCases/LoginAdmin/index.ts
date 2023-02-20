import { AdminRepository } from '../../repositories/AdminRepository'
import { LoginAdminController } from './LoginAdminController'
import { LoginAdminUseCase } from './LoginAdminUseCase'

const adminRepository = new AdminRepository()
const loginAdminUseCase = new LoginAdminUseCase(adminRepository)

const loginAdminController = new LoginAdminController(loginAdminUseCase)

export { loginAdminUseCase, loginAdminController }
