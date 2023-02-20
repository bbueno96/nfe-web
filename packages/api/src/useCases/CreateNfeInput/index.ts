import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { CreateNfeInputController } from './CreateNfeInputController'
import { CreateNfeInputUseCase } from './CreateNfeInputUseCase'

const nfeRepository = new NfeRepository()
const providerRepository = new ProviderRepository()
const nfeProductsRepository = new NfeProductsRepository()
const parameterRepository = new ParameterRepository()
const productRepository = new ProductRepository()
const taxSituationsRepository = new TaxSituationsRepository()
const accountPayableRepository = new AccountPayableRepository()
const stockProductsRepository = new StockProductsRepository()

const createNfeInputUseCase = new CreateNfeInputUseCase(
  nfeRepository,
  providerRepository,
  productRepository,
  nfeProductsRepository,
  taxSituationsRepository,
  parameterRepository,
  accountPayableRepository,
  stockProductsRepository,
)

const createNfeInputController = new CreateNfeInputController(createNfeInputUseCase)

export { createNfeInputUseCase, createNfeInputController }
