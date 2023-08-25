import { NfeRepository } from '../../repositories/NfeRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProviderProductsRepository } from '../../repositories/ProviderProductsRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { ReadXmlController } from './ReadXmlController'
import { ReadXmlUseCase } from './ReadXmlUseCase'

const providerRepository = new ProviderRepository()
const productRepository = new ProductRepository()
const providerProductsRepository = new ProviderProductsRepository()
const nfeRepository = new NfeRepository()

const readXmlUseCase = new ReadXmlUseCase(
  providerRepository,
  providerProductsRepository,
  productRepository,
  nfeRepository,
)

const readXmlController = new ReadXmlController(readXmlUseCase)

export { readXmlUseCase, readXmlController }
