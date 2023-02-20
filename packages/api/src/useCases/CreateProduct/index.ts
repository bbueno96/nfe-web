import { ProductRepository } from '../../repositories/ProductRepository'
import { CreateProductController } from './CreateProductController'
import { CreateProductUseCase } from './CreateProductUseCase'

const productRepository = new ProductRepository()

const createProductUseCase = new CreateProductUseCase(productRepository)

const createProductController = new CreateProductController(createProductUseCase)

export { createProductUseCase, createProductController }
