import { BrandRepository } from '../../repositories/BrandRepository'
import { IListBrandFilters } from './ListBrandDTO'

export class ListBrandUseCase {
  constructor(private brandRepository: BrandRepository) {}

  async execute(filters: IListBrandFilters) {
    const data = await this.brandRepository.list(filters)
    return data
  }
}
