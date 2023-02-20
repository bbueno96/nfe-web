import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { GetPayMethodByIdController } from './GetPayMethodByIdController'
import { GetPayMethodByIdUseCase } from './GetPayMethodByIdUseCase'

const payMethodRepository = new PayMethodsRepository()
const getPayMethodByIdUseCase = new GetPayMethodByIdUseCase(payMethodRepository)

const getPayMethodByIdController = new GetPayMethodByIdController(getPayMethodByIdUseCase)

export { getPayMethodByIdUseCase, getPayMethodByIdController }
