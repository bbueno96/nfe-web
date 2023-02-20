import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { IListClassificationFilters } from './ListClassificationDTO'

export class ListClassificationUseCase {
  constructor(private classificationRepository: ClassificationRepository) {}

  async execute(filters: IListClassificationFilters) {
    const data = await this.classificationRepository.list(filters)
    return data
  }
}
