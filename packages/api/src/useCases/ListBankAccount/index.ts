import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { ListBankAccountController } from './ListBankAccountController'
import { ListBankAccountUseCase } from './ListBankAccountUseCase'

const bankAccountRepository = new BankAccountRepository()
const listBankAccountUseCase = new ListBankAccountUseCase(bankAccountRepository)

const listBankAccountController = new ListBankAccountController(listBankAccountUseCase)

export { listBankAccountUseCase, listBankAccountController }
