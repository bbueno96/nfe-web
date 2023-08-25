import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { ListProductTaxPostController } from './ListProductTaxPostController'
import { ListProductTaxPostUseCase } from './ListProductTaxPostUseCase'

const productTaxRepository = new ProductTaxRepository()
const listProductTaxPostUseCase = new ListProductTaxPostUseCase(productTaxRepository)

const listProductTaxPostController = new ListProductTaxPostController(listProductTaxPostUseCase)

export { listProductTaxPostUseCase, listProductTaxPostController }
