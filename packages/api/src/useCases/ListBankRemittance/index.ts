import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ListBankRemittanceController } from './ListBankRemittanceController'
import { ListBankRemittanceUseCase } from './ListBankRemittanceUseCase'

const installmentRepository = new InstallmentRepository()
const listBankRemittanceUseCase = new ListBankRemittanceUseCase(installmentRepository)

const listBankRemittanceController = new ListBankRemittanceController(listBankRemittanceUseCase)

export { listBankRemittanceUseCase, listBankRemittanceController }
