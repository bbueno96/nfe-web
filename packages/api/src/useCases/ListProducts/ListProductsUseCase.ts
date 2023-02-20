import { ProductRepository } from '../../repositories/ProductRepository'
import { IListProductsFilters } from './ListProductsDTO'

export class ListProductsUseCase {
  constructor(private customerRepository: ProductRepository) {}

  async execute(filters: IListProductsFilters) {
    const data = await this.customerRepository.list(filters)
    return data
  }
}
