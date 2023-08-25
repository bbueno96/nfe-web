import { ProductTaxRepository } from '../../repositories/ProductTaxRepository'
import { IListProductTaxFilters } from './ListProductTaxPostDTO'

export class ListProductTaxPostUseCase {
  constructor(private productTaxRepository: ProductTaxRepository) {}

  async execute(filters: IListProductTaxFilters) {
    const data = await this.productTaxRepository.listPost(filters)
    return data
  }
}
