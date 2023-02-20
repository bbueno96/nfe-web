import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { CheckNfeController } from './CheckNfeController'
import { CheckNfeUseCase } from './CheckNfeUseCase'

const nfeRepository = new NfeRepository()
const parameterRepository = new ParameterRepository()

const checkNfeUseCase = new CheckNfeUseCase(nfeRepository, parameterRepository)

const checkNfeController = new CheckNfeController(checkNfeUseCase)

export { checkNfeUseCase, checkNfeController }
