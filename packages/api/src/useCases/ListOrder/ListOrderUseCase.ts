import { OrderRepository } from '../../repositories/OrderRepository'
import { IListOrderFilters } from './ListOrderDTO'

export class ListOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(filters: IListOrderFilters) {
    const data = await this.orderRepository.list(filters)
    return data
  }
}
