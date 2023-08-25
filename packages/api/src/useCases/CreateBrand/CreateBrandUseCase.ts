import { BrandRepository } from '../../repositories/BrandRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateBrandDTO } from './CreateBrandDTO'

export class CreateBrandUseCase {
  constructor(private brandRepository: BrandRepository) {}

  sanitizeData(data: ICreateBrandDTO) {
    data.description = data.description?.trim()
  }

  validate(data: ICreateBrandDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateBrandDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const brand = await this.brandRepository.create({
      ...data,
    })
    return brand.id
  }
}
