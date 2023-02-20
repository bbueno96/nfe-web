import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { GetBankAccountByIdController } from './GetBankAccountByIdController'
import { GetBankAccountByIdUseCase } from './GetBankAccountByIdUseCase'

const bankAccountRepository = new BankAccountRepository()
const getBankAccountByIdUseCase = new GetBankAccountByIdUseCase(bankAccountRepository)

const getBankAccountByIdController = new GetBankAccountByIdController(getBankAccountByIdUseCase)

export { getBankAccountByIdUseCase, getBankAccountByIdController }
