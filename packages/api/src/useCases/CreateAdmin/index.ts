import { AdminRepository } from '../../repositories/AdminRepository'
import { CreateAdminController } from './CreateAdminController'
import { CreateAdminUseCase } from './CreateAdminUseCase'

const adminRepository = new AdminRepository()

const createAdminUseCase = new CreateAdminUseCase(adminRepository)

const createAdminController = new CreateAdminController(createAdminUseCase)

export { createAdminUseCase, createAdminController }
