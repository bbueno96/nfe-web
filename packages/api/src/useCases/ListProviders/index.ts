import { ProviderRepository } from '../../repositories/ProviderRepository'
import { ListProvidersController } from './ListProvidersController'
import { ListProvidersUseCase } from './ListProvidersUseCase'

const providerRepository = new ProviderRepository()
const listProvidersUseCase = new ListProvidersUseCase(providerRepository)

const listProvidersController = new ListProvidersController(listProvidersUseCase)

export { listProvidersUseCase, listProvidersController }
