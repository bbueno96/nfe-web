import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ValidationNfeController } from './ValidationNfeController'
import { ValidationNfeUseCase } from './ValidationNfeUseCase'

const nfeRepository = new NfeRepository()
const parameterRepository = new ParameterRepository()

const validationNfeUseCase = new ValidationNfeUseCase(nfeRepository, parameterRepository)

const validationNfeController = new ValidationNfeController(validationNfeUseCase)

export { validationNfeUseCase, validationNfeController }
