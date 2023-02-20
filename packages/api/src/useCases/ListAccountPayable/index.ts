import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { ListAccountPayableController } from './ListAccountPayableController'
import { ListAccountPayableUseCase } from './ListAccountPayableUseCase'

const accountPayableRepository = new AccountPayableRepository()
const listAccountPayableUseCase = new ListAccountPayableUseCase(accountPayableRepository)

const listAccountPayableController = new ListAccountPayableController(listAccountPayableUseCase)

export { listAccountPayableUseCase, listAccountPayableController }
