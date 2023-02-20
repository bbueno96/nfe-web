import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { GetAccountPayableByIdController } from './GetAccountPayableByIdController'
import { GetAccountPayableByIdUseCase } from './GetAccountPayableByIdUseCase'

const accountPayableRepository = new AccountPayableRepository()
const getAccountPayableByIdUseCase = new GetAccountPayableByIdUseCase(accountPayableRepository)

const getAccountPayableByIdController = new GetAccountPayableByIdController(getAccountPayableByIdUseCase)

export { getAccountPayableByIdUseCase, getAccountPayableByIdController }
