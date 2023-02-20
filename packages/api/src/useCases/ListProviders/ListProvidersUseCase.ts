import { ProviderRepository } from '../../repositories/ProviderRepository'
import { IListProvidersFilters } from './ListProvidersDTO'

export class ListProvidersUseCase {
  constructor(private providerRepository: ProviderRepository) {}

  async execute(filters: IListProvidersFilters) {
    const data = await this.providerRepository.listOutro(filters)

    return data
  }
}
