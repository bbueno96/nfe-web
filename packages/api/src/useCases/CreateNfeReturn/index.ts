import { NfeProductsRepository } from '../../repositories/NfeProductsRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { CreateNfeReturnController } from './CreateNfeReturnController'
import { CreateNfeReturnUseCase } from './CreateNfeReturnUseCase'

const nfeRepository = new NfeRepository()
const nfeProductsRepository = new NfeProductsRepository()
const parameterRepository = new ParameterRepository()

const createNfeReturnUseCase = new CreateNfeReturnUseCase(nfeRepository, nfeProductsRepository, parameterRepository)

const createNfeReturnController = new CreateNfeReturnController(createNfeReturnUseCase)

export { createNfeReturnUseCase, createNfeReturnController }
