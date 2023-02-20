import { ClassificationRepository } from '../../repositories/ClassificationRepository'
import { GetClassificationByIdController } from './GetClassificationByIdController'
import { GetClassificationByIdUseCase } from './GetClassificationByIdUseCase'

const classificationRepository = new ClassificationRepository()
const getClassificationByIdUseCase = new GetClassificationByIdUseCase(classificationRepository)

const getClassificationByIdController = new GetClassificationByIdController(getClassificationByIdUseCase)

export { getClassificationByIdUseCase, getClassificationByIdController }
