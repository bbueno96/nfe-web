import { ParameterRepository } from '../../repositories/ParameterRepository'
import { UpdateParameterController } from './UpdateParameterController'
import { UpdateParameterUseCase } from './UpdateParameterUseCase'

const parameterRepository = new ParameterRepository()
const updateParameterUseCase = new UpdateParameterUseCase(parameterRepository)

const updateParameterController = new UpdateParameterController(updateParameterUseCase)

export { updateParameterUseCase, updateParameterController }
