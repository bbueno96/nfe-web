import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { ApiError } from '../../utils/ApiError'

export class GetClassificationByIdUseCase {
  constructor(private classificationRepository: ClassificationRepository) {}

  async execute(id: string) {
    const customer = await this.classificationRepository.findById(id)

    if (!customer) {
      throw new ApiError('Nenhum Cliente encontrado.', 404)
    }

    return customer
  }
}
