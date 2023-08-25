import { BrandRepository } from '../../repositories/BrandRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateBrandDTO } from './UpdateBrandDTO'

export class UpdateBrandUseCase {
  constructor(private brandRepository: BrandRepository) {}

  sanitizeData(data: IUpdateBrandDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateBrandDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateBrandDTO) {
    const oldData = await this.brandRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Vendedor não encontrado.', 404)
    }

    this.sanitizeData(data)
    this.validate(data)

    await this.brandRepository.update(data.id, {
      ...data,
    })
  }
}
