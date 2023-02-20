import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { GetBoletoPdfByInstallmentController } from './GetBoletoPdfByInstallmentController'
import { GetBoletoPdfByInstallmentUseCase } from './GetBoletoPdfByInstallmentUseCase'

const installmentRepository = new InstallmentRepository()

const getBoletoPdfByInstallmentUseCase = new GetBoletoPdfByInstallmentUseCase(installmentRepository)

const getBoletoPdfByInstallmentController = new GetBoletoPdfByInstallmentController(getBoletoPdfByInstallmentUseCase)

export { getBoletoPdfByInstallmentUseCase, getBoletoPdfByInstallmentController }
