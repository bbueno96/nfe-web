import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { GetNfeByIdController } from './GetNfeByIdController'
import { GetNfeByIdUseCase } from './GetNfeByIdUseCase'

const parameterRepository = new ParameterRepository()
const nfeRepository = new NfeRepository()
const getNfeByIdUseCase = new GetNfeByIdUseCase(nfeRepository, parameterRepository)

const getNfeByIdController = new GetNfeByIdController(getNfeByIdUseCase)

export { getNfeByIdUseCase, getNfeByIdController }
