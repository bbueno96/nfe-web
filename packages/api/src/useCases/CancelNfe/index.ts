import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { CancelNfeController } from './CancelNfeController'
import { CancelNfeUseCase } from './CancelNfeUseCase'

const nfeRepository = new NfeRepository()
const parameterRepository = new ParameterRepository()

const cancelNfeUseCase = new CancelNfeUseCase(nfeRepository, parameterRepository)

const cancelNfeController = new CancelNfeController(cancelNfeUseCase)

export { cancelNfeUseCase, cancelNfeController }
