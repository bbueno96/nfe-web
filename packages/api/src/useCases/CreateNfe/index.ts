import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { PayMethodsRepository } from '../../repositories/PayMethodRepository'
import { ProductRepository } from '../../repositories/ProductRepository'
import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { CreateNfeController } from './CreateNfeController'
import { CreateNfeUseCase } from './CreateNfeUseCase'

const nfeRepository = new NfeRepository()
const customerRepository = new CustomerRepository()
const nfeProductsRepository = new NfeProductsRepository()
const parameterRepository = new ParameterRepository()
const productRepository = new ProductRepository()
const productTaxRepository = new ProductTaxRepository()
const installmentRepository = new InstallmentRepository()
const payMethodsRepository = new PayMethodsRepository()
const bankAccountRepository = new BankAccountRepository()
const stockProductsRepository = new StockProductsRepository()
const orderRepository = new OrderRepository()

const createNfeUseCase = new CreateNfeUseCase(
  nfeRepository,
  customerRepository,
  productRepository,
  nfeProductsRepository,
  productTaxRepository,
  parameterRepository,
  installmentRepository,
  payMethodsRepository,
  bankAccountRepository,
  stockProductsRepository,
  orderRepository,
)

const createNfeController = new CreateNfeController(createNfeUseCase)

export { createNfeUseCase, createNfeController }
