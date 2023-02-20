import { AdminRepository } from '../../repositories/AdminRepository'
import { ListAdminsController } from './ListAdminsController'
import { ListAdminsUseCase } from './ListAdminsUseCase'

const adminRepository = new AdminRepository()
const listAdminsUseCase = new ListAdminsUseCase(adminRepository)

const listAdminsController = new ListAdminsController(listAdminsUseCase)

export { listAdminsUseCase, listAdminsController }
