import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ListPayMethodController } from './ListPayMethodController'
import { ListPayMethodUseCase } from './ListPayMethodUseCase'

const payMethodsRepository = new PayMethodsRepository()
const listPayMethodUseCase = new ListPayMethodUseCase(payMethodsRepository)

const listPayMethodController = new ListPayMethodController(listPayMethodUseCase)

export { listPayMethodUseCase, listPayMethodController }
