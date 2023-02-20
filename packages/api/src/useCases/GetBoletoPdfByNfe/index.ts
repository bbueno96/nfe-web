import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { GetBoletoPdfController } from './GetBoletoPdfController'
import { GetBoletoPdfUseCase } from './GetBoletoPdfUseCase'

const installmentRepository = new InstallmentRepository()

const getBoletoPdfUseCase = new GetBoletoPdfUseCase(installmentRepository)

const getBoletoPdfController = new GetBoletoPdfController(getBoletoPdfUseCase)

export { getBoletoPdfUseCase, getBoletoPdfController }
