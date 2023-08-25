import { ProductRepository } from '../../repositories/ProductRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { UpdateProductController } from './UpdateProductController'
import { UpdateProductUseCase } from './UpdateProductUseCase'

const productRepository = new ProductRepository()
const productTaxRepository = new ProductTaxRepository()

const updateProductUseCase = new UpdateProductUseCase(productRepository, productTaxRepository)

const updateProductController = new UpdateProductController(updateProductUseCase)

export { updateProductUseCase, updateProductController }
