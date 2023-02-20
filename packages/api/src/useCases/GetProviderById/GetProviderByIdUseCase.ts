import { ProviderRepository } from '../../repositories/ProviderRepository'
import { ApiError } from '../../utils/ApiError'

export class GetProviderByIdUseCase {
  constructor(private providerRepository: ProviderRepository) {}

  async execute(id: string) {
    const provider = await this.providerRepository.findById(id)

    if (!provider) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }

    return provider
  }
}
