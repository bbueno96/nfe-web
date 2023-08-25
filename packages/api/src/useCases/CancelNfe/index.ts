import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { CancelNfeController } from './CancelNfeController'
import { CancelNfeUseCase } from './CancelNfeUseCase'

const nfeRepository = new NfeRepository()
const nfeProductsRepository = new NfeProductsRepository()
const productRepository = new ProductRepository()
const stockProductsRepository = new StockProductsRepository()
const parameterRepository = new ParameterRepository()

const cancelNfeUseCase = new CancelNfeUseCase(
  nfeRepository,
  productRepository,
  nfeProductsRepository,
  stockProductsRepository,
  parameterRepository,
)

const cancelNfeController = new CancelNfeController(cancelNfeUseCase)

export { cancelNfeUseCase, cancelNfeController }
