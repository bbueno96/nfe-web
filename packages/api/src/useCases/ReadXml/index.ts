import { ProductRepository } from '../../repositories/ProductRepository'
import { ProviderProductsRepository } from '../../repositories/ProviderProductsRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ReadXmlController } from './ReadXmlController'
import { ReadXmlUseCase } from './ReadXmlUseCase'

const providerRepository = new ProviderRepository()
const productRepository = new ProductRepository()
const providerProductsRepository = new ProviderProductsRepository()
const taxSituationsRepository = new TaxSituationsRepository()

const readXmlUseCase = new ReadXmlUseCase(
  providerRepository,
  providerProductsRepository,
  productRepository,
  taxSituationsRepository,
)

const readXmlController = new ReadXmlController(readXmlUseCase)

export { readXmlUseCase, readXmlController }
