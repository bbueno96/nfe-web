import { ProductRepository } from '../../repositories/ProductRepository'
import { UpdateProductController } from './UpdateProductController'
import { UpdateProductUseCase } from './UpdateProductUseCase'

const productRepository = new ProductRepository()

const updateProductUseCase = new UpdateProductUseCase(productRepository)

const updateProductController = new UpdateProductController(updateProductUseCase)

export { updateProductUseCase, updateProductController }
