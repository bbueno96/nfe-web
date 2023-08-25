import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ListProductsController } from './ListProductsController'
import { ListProductsUseCase } from './ListProductsUseCase'

const productRepository = new ProductRepository()
const parameterRepository = new ParameterRepository()
const listProductsUseCase = new ListProductsUseCase(productRepository)

const listProductsController = new ListProductsController(listProductsUseCase, parameterRepository)

export { listProductsUseCase, listProductsController }
