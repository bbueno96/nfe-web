import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { GetOrderByIdController } from './GetOrderByIdController'
import { GetOrderByIdUseCase } from './GetOrderByIdUseCase'

const orderRepository = new OrderRepository()
const orderProductsRepository = new OrderProductsRepository()
const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository, orderProductsRepository)

const getOrderByIdController = new GetOrderByIdController(getOrderByIdUseCase)

export { getOrderByIdUseCase, getOrderByIdController }
