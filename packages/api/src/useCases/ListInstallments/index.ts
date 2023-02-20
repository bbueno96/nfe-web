import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ListInstallmentController } from './ListInstallmentsController'
import { ListInstallmentUseCase } from './ListInstallmentsUseCase'

const installmentRepository = new InstallmentRepository()
const listInstallmentUseCase = new ListInstallmentUseCase(installmentRepository)

const listInstallmentController = new ListInstallmentController(listInstallmentUseCase)

export { listInstallmentUseCase, listInstallmentController }
