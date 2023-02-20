import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { CreateAccountPayableController } from './CreateAccountPayableController'
import { CreateAccountPayableUseCase } from './CreateAccountPayableUseCase'

const accountPayableRepository = new AccountPayableRepository()

const createAccountPayableUseCase = new CreateAccountPayableUseCase(accountPayableRepository)

const createAccountPayableController = new CreateAccountPayableController(createAccountPayableUseCase)

export { createAccountPayableUseCase, createAccountPayableController }
