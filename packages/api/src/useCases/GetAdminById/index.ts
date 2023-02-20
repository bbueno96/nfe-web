import { AdminRepository } from '../../repositories/AdminRepository'
import { GetAdminByIdController } from './GetAdminByIdController'
import { GetAdminByIdUseCase } from './GetAdminByIdUseCase'

const adminRepository = new AdminRepository()
const getAdminByIdUseCase = new GetAdminByIdUseCase(adminRepository)

const getAdminByIdController = new GetAdminByIdController(getAdminByIdUseCase)

export { getAdminByIdUseCase, getAdminByIdController }
