import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { ListClassificationController } from './ListClassificationController'
import { ListClassificationUseCase } from './ListClassificationUseCase'

const classificationRepository = new ClassificationRepository()
const listClassificationUseCase = new ListClassificationUseCase(classificationRepository)

const listClassificationController = new ListClassificationController(listClassificationUseCase)

export { listClassificationUseCase, listClassificationController }
