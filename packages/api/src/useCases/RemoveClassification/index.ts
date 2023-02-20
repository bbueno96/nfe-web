import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { RemoveClassificationController } from './RemoveClassificationController'
import { RemoveClassificationUseCase } from './RemoveClassificationUseCase'

const classificationRepository = new ClassificationRepository()
const removeClassificationUseCase = new RemoveClassificationUseCase(classificationRepository)

const removeClassificationController = new RemoveClassificationController(removeClassificationUseCase)

export { removeClassificationUseCase, removeClassificationController }
