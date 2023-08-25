import { ProductRepository } from '../../repositories/ProductRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { CreateProductController } from './CreateProductController'
import { CreateProductUseCase } from './CreateProductUseCase'

const productRepository = new ProductRepository()
const productTaxRepository = new ProductTaxRepository()

const createProductUseCase = new CreateProductUseCase(productRepository, productTaxRepository)

const createProductController = new CreateProductController(createProductUseCase)

export { createProductUseCase, createProductController }
