import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CreateBankAccountController } from './CreateBankAccountController'
import { CreateBankAccountUseCase } from './CreateBankAccountUseCase'

const bankAccountRepository = new BankAccountRepository()

const createBankAccountUseCase = new CreateBankAccountUseCase(bankAccountRepository)

const createBankAccountController = new CreateBankAccountController(createBankAccountUseCase)

export { createBankAccountUseCase, createBankAccountController }
