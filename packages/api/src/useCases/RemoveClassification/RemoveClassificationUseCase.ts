import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { ApiError } from '../../utils/ApiError'

export class RemoveClassificationUseCase {
  constructor(private classificationRepository: ClassificationRepository) {}

  async execute(id: string) {
    const classification = await this.classificationRepository.findById(id)

    if (!classification) {
      throw new ApiError('Nenhuma Classificação encontrada.', 404)
    }
    await this.classificationRepository.remove({ ...classification, disabledAt: new Date() })
    return classification
  }
}
