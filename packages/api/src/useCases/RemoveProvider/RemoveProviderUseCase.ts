import { ProviderRepository } from '../../repositories/ProviderRepository'
import { ApiError } from '../../utils/ApiError'

export class RemoveProviderUseCase {
  constructor(private providerRepository: ProviderRepository) {}

  async execute(id: string) {
    const provider = await this.providerRepository.findById(id)

    if (!provider) {
      throw new ApiError('Nenhum fornecedor encontrado.', 404)
    }
    await this.providerRepository.remove({ ...provider, disableAt: new Date() })
    return provider
  }
}
