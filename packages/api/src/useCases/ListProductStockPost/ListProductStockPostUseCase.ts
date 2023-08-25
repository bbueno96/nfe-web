import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { IListProductStockFilters } from './ListProductStockPostDTO'

export class ListProductStockPostUseCase {
  constructor(private stockProductsRepository: StockProductsRepository) {}

  async execute(filters: IListProductStockFilters) {
    const data = await this.stockProductsRepository.findByProduct(filters.product || '', filters.companyId || '')
    return data
  }
}
