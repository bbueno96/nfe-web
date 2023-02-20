import { ProductRepository } from '../../repositories/ProductRepository'
import { GetProductByIdController } from './GetProductByIdController'
import { GetProductByIdUseCase } from './GetProductByIdUseCase'

const groupRepository = new ProductRepository()
const getProductByIdUseCase = new GetProductByIdUseCase(groupRepository)

const getProductByIdController = new GetProductByIdController(getProductByIdUseCase)

export { getProductByIdUseCase, getProductByIdController }
