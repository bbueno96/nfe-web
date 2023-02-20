import { ProviderRepository } from '../../repositories/ProviderRepository'
import { GetProviderByIdController } from './GetProviderByIdController'
import { GetProviderByIdUseCase } from './GetProviderByIdUseCase'

const providerRepository = new ProviderRepository()
const getProviderByIdUseCase = new GetProviderByIdUseCase(providerRepository)

const getProviderByIdController = new GetProviderByIdController(getProviderByIdUseCase)

export { getProviderByIdUseCase, getProviderByIdController }
