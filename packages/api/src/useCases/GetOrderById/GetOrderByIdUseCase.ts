import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ApiError } from '../../utils/ApiError'

export class GetOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository, private orderProductsRepository: OrderProductsRepository) {}

  async execute(id: string) {
    const order = await this.orderRepository.findById(id)
    const OrderProducts = await this.orderProductsRepository.findByOrder(order.id)

    if (!order) {
      throw new ApiError('Nenhum Pedido Encontrado.', 404)
    }

    return { ...order, OrderProducts }
  }
}
