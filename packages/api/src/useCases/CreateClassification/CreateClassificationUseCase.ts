import { Classification } from '../../entities/Classification'
import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateClassificationDTO } from './CreateClassificationDTO'

export class CreateClassificationUseCase {
  constructor(private classificationRepository: ClassificationRepository) {}

  sanitizeData(data: ICreateClassificationDTO) {
    data.description = data.description?.trim()
  }

  validate(data: ICreateClassificationDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateClassificationDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const brand = await this.classificationRepository.create(
      Classification.create({
        ...data,
      }),
    )
    return brand.id
  }
}
