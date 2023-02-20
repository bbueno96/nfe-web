import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { CreatePayMethodController } from './CreatePayMethodController'
import { CreatePayMethodUseCase } from './CreatePayMethodUseCase'

const payMethodRepository = new PayMethodsRepository()

const createPayMethodUseCase = new CreatePayMethodUseCase(payMethodRepository)

const createPayMethodController = new CreatePayMethodController(createPayMethodUseCase)

export { createPayMethodUseCase, createPayMethodController }
