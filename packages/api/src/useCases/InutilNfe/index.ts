import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { InutilNfeController } from './InutilNfeController'
import { InutilNfeUseCase } from './InutilNfeUseCase'

const nfeRepository = new NfeRepository()
const parameterRepository = new ParameterRepository()

const inutilNfeUseCase = new InutilNfeUseCase(nfeRepository, parameterRepository)

const inutilNfeController = new InutilNfeController(inutilNfeUseCase)

export { inutilNfeUseCase, inutilNfeController }
