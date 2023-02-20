import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateClassificationDTO } from './UpdateClassificationDTO'

export class UpdateClassificationUseCase {
  constructor(private classificationRepository: ClassificationRepository) {}

  sanitizeData(data: IUpdateClassificationDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateClassificationDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateClassificationDTO) {
    const oldData = await this.classificationRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Vendedor não encontrado.', 404)
    }

    this.sanitizeData(data)
    this.validate(data)

    await this.classificationRepository.update({
      ...data,
    })
  }
}
