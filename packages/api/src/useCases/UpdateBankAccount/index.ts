import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { UpdateBankAccountController } from './UpdateBankAccountController'
import { UpdateBankAccountUseCase } from './UpdateBankAccountUseCase'

const bankAccountRepository = new BankAccountRepository()
const updateBankAccountUseCase = new UpdateBankAccountUseCase(bankAccountRepository)

const updateBankAccountController = new UpdateBankAccountController(updateBankAccountUseCase)

export { updateBankAccountUseCase, updateBankAccountController }
