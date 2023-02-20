import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { CreateClassificationController } from './CreateClassificationController'
import { CreateClassificationUseCase } from './CreateClassificationUseCase'

const classificationRepository = new ClassificationRepository()

const createClassificationUseCase = new CreateClassificationUseCase(classificationRepository)

const createClassificationController = new CreateClassificationController(createClassificationUseCase)

export { createClassificationUseCase, createClassificationController }
