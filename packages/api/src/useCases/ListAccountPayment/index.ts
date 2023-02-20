import { AccountPaymentRepository } from '../../repositories/AccountPaymentRepository'
import { ListAccountPaymentController } from './ListAccountPaymentController'
import { ListAccountPaymentUseCase } from './ListAccountPaymentUseCase'

const accountPaymentRepository = new AccountPaymentRepository()
const listAccountPaymentUseCase = new ListAccountPaymentUseCase(accountPaymentRepository)

const listAccountPaymentController = new ListAccountPaymentController(listAccountPaymentUseCase)

export { listAccountPaymentUseCase, listAccountPaymentController }
