import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { UpdateOrderController } from './UpdateOrderController'
import { UpdateOrderUseCase } from './UpdateOrderUseCase'

const orderRepository = new OrderRepository()
const orderProductsRepository = new OrderProductsRepository()
const parameterRepository = new ParameterRepository()
const updateOrderUseCase = new UpdateOrderUseCase(orderRepository, orderProductsRepository, parameterRepository)

const updateOrderController = new UpdateOrderController(updateOrderUseCase)

export { updateOrderUseCase, updateOrderController }
