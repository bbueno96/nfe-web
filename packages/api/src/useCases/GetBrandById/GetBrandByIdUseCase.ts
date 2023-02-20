import { BrandRepository } from '../../repositories/BrandRepository'
import { ApiError } from '../../utils/ApiError'

export class GetBrandByIdUseCase {
  constructor(private brandRepository: BrandRepository) {}

  async execute(id: string) {
    const customer = await this.brandRepository.findById(id)

    if (!customer) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }

    return customer
  }
}
