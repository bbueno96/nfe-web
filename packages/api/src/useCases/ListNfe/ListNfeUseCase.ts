import { NfeRepository } from '../../repositories/NfeRepository'
import { IListNfeFilters } from './ListNfeDTO'

export class ListNfeUseCase {
  constructor(private nfeRepository: NfeRepository) {}

  async execute(filters: IListNfeFilters) {
    const data = await this.nfeRepository.list(filters)

    return data
  }
}
