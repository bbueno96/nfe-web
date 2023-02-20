import { BudgetRepository } from '../../repositories/BudgetRepository'
import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { CreateOrderController } from './CreateOrderController'
import { CreateOrderUseCase } from './CreateOrderUseCase'

const orderRepository = new OrderRepository()
const orderProductsRepository = new OrderProductsRepository()
const parameterRepository = new ParameterRepository()
const budgetRepository = new BudgetRepository()

const createOrderUseCase = new CreateOrderUseCase(
  orderRepository,
  orderProductsRepository,
  parameterRepository,
  budgetRepository,
)

const createOrderController = new CreateOrderController(createOrderUseCase)

export { createOrderUseCase, createOrderController }
