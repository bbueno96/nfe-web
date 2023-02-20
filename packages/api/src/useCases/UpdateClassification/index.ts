import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { UpdateClassificationController } from './UpdateClassificationController'
import { UpdateClassificationUseCase } from './UpdateClassificationUseCase'

const classificationRepository = new ClassificationRepository()
const updateClassificationUseCase = new UpdateClassificationUseCase(classificationRepository)

const updateClassificationController = new UpdateClassificationController(updateClassificationUseCase)

export { updateClassificationUseCase, updateClassificationController }
