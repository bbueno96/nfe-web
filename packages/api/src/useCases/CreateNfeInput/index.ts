import { AccountPayableRepository } from '../../repositories/AccountPayableRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { ProviderRepository } from '../../repositories/ProviderRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { CreateNfeInputController } from './CreateNfeInputController'
import { CreateNfeInputUseCase } from './CreateNfeInputUseCase'

const nfeRepository = new NfeRepository()
const providerRepository = new ProviderRepository()
const nfeProductsRepository = new NfeProductsRepository()
const parameterRepository = new ParameterRepository()
const productRepository = new ProductRepository()
const productTaxRepository = new ProductTaxRepository()
const accountPayableRepository = new AccountPayableRepository()
const stockProductsRepository = new StockProductsRepository()

const createNfeInputUseCase = new CreateNfeInputUseCase(
  nfeRepository,
  providerRepository,
  productRepository,
  nfeProductsRepository,
  productTaxRepository,
  parameterRepository,
  accountPayableRepository,
  stockProductsRepository,
)

const createNfeInputController = new CreateNfeInputController(createNfeInputUseCase)

export { createNfeInputUseCase, createNfeInputController }
