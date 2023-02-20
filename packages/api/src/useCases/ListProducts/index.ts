import { ProductRepository } from '../../repositories/ProductRepository'
import { ListProductsController } from './ListProductsController'
import { ListProductsUseCase } from './ListProductsUseCase'

const productRepository = new ProductRepository()
const listProductsUseCase = new ListProductsUseCase(productRepository)

const listProductsController = new ListProductsController(listProductsUseCase)

export { listProductsUseCase, listProductsController }
