import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { AccountPaymentRepository } from '../../repositories/AccountPaymentRepository'
import { CreateAccountPaymentController } from './CreateAccountPaymentController'
import { CreateAccountPaymentUseCase } from './CreateAccountPaymentUseCase'

const accountPaymentRepository = new AccountPaymentRepository()
const accountPayableRepository = new AccountPayableRepository()
const createAccountPaymentUseCase = new CreateAccountPaymentUseCase(accountPaymentRepository, accountPayableRepository)

const createAccountPaymentController = new CreateAccountPaymentController(createAccountPaymentUseCase)

export { createAccountPaymentUseCase, createAccountPaymentController }
