import { OrderRepository } from '../../repositories/OrderRepository'
import { RemoveOrderController } from './RemoveOrderController'
import { RemoveOrderUseCase } from './RemoveOrderUseCase'

const orderRepository = new OrderRepository()
const removeOrderUseCase = new RemoveOrderUseCase(orderRepository)

const removeOrderController = new RemoveOrderController(removeOrderUseCase)

export { removeOrderUseCase, removeOrderController }
