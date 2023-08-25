import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { UpdateProductTaxController } from './UpdateProductTaxController'
import { UpdateProductTaxUseCase } from './UpdateProductTaxUseCase'

const productTaxRepository = new ProductTaxRepository()
const updateProductTaxUseCase = new UpdateProductTaxUseCase(productTaxRepository)

const updateProductTaxController = new UpdateProductTaxController(updateProductTaxUseCase)

export { updateProductTaxUseCase, updateProductTaxController }
