import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { UpdateAccountPayableController } from './UpdateAccountPayableController'
import { UpdateAccountPayableUseCase } from './UpdateAccountPayableUseCase'

const accountPayableRepository = new AccountPayableRepository()
const updateAccountPayableUseCase = new UpdateAccountPayableUseCase(accountPayableRepository)

const updateAccountPayableController = new UpdateAccountPayableController(updateAccountPayableUseCase)

export { updateAccountPayableUseCase, updateAccountPayableController }
