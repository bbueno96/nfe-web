import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { UpdatePayMethodController } from './UpdatePayMethodController'
import { UpdatePayMethodUseCase } from './UpdatePayMethodUseCase'

const payMethodRepository = new PayMethodsRepository()
const updatePayMethodUseCase = new UpdatePayMethodUseCase(payMethodRepository)

const updatePayMethodController = new UpdatePayMethodController(updatePayMethodUseCase)

export { updatePayMethodUseCase, updatePayMethodController }
