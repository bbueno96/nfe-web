import { AdminRepository } from '../../repositories/AdminRepository'
import { UpdateAdminController } from './UpdateAdminController'
import { UpdateAdminUseCase } from './UpdateAdminUseCase'

const adminRepository = new AdminRepository()

const updateAdminUseCase = new UpdateAdminUseCase(adminRepository)

const updateAdminController = new UpdateAdminController(updateAdminUseCase)

export { updateAdminUseCase, updateAdminController }
