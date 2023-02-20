import { ParameterRepository } from '../../repositories/ParameterRepository'
import { GetParameterController } from './GetParameterController'
import { GetParameterUseCase } from './GetParameterUseCase'

const parameterRepository = new ParameterRepository()
const getParameterUseCase = new GetParameterUseCase(parameterRepository)

const getParameterController = new GetParameterController(getParameterUseCase)

export { getParameterUseCase, getParameterController }
