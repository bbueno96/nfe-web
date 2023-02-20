import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { GetInstallmentByIdController } from './GetInstallmentByIdController'
import { GetInstallmentByIdUseCase } from './GetInstallmentByIdUseCase'

const installmentRepository = new InstallmentRepository()
const getInstallmentByIdUseCase = new GetInstallmentByIdUseCase(installmentRepository)

const getInstallmentByIdController = new GetInstallmentByIdController(getInstallmentByIdUseCase)

export { getInstallmentByIdUseCase, getInstallmentByIdController }
