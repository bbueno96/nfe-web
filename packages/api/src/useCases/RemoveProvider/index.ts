import { ProviderRepository } from '../../repositories/ProviderRepository'
import { RemoveProviderController } from './RemoveProviderController'
import { RemoveProviderUseCase } from './RemoveProviderUseCase'

const providerRepository = new ProviderRepository()
const removeProviderUseCase = new RemoveProviderUseCase(providerRepository)

const removeProviderController = new RemoveProviderController(removeProviderUseCase)

export { removeProviderUseCase, removeProviderController }
