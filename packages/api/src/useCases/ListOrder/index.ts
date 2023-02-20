import { OrderRepository } from '../../repositories/OrderRepository'
import { ListOrderController } from './ListOrderController'
import { ListOrderUseCase } from './ListOrderUseCase'

const orderRepository = new OrderRepository()
const listOrderUseCase = new ListOrderUseCase(orderRepository)

const listOrderController = new ListOrderController(listOrderUseCase)

export { listOrderUseCase, listOrderController }
