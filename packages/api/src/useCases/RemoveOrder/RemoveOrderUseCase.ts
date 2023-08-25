import { OrderRepository } from '../../repositories/OrderRepository'
import { ApiError } from '../../utils/ApiError'

export class RemoveOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string) {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      throw new ApiError('Pedido não encontrado.', 404)
    }
    await this.orderRepository.remove({ ...order, disabledAt: new Date() }, null)
    return order
  }
}
