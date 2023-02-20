import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { UpdateNfeController } from './UpdateNfeController'
import { UpdateNfeUseCase } from './UpdateNfeUseCase'

const nfeRepository = new NfeRepository()
const customerRepository = new CustomerRepository()
const nfeProductsRepository = new NfeProductsRepository()
const parameterRepository = new ParameterRepository()
const productRepository = new ProductRepository()
const taxSituationsRepository = new TaxSituationsRepository()
const installmentRepository = new InstallmentRepository()
const payMethodsRepository = new PayMethodsRepository()
const bankAccountRepository = new BankAccountRepository()
const stockProductsRepository = new StockProductsRepository()

const updateNfeUseCase = new UpdateNfeUseCase(
  nfeRepository,
  customerRepository,
  productRepository,
  nfeProductsRepository,
  taxSituationsRepository,
  parameterRepository,
  installmentRepository,
  payMethodsRepository,
  bankAccountRepository,
  stockProductsRepository,
)

const updateNfeController = new UpdateNfeController(updateNfeUseCase)

export { updateNfeUseCase, updateNfeController }
