import { ProviderRepository } from '../../repositories/ProviderRepository'
import { UpdateProviderController } from './UpdateProviderController'
import { UpdateProviderUseCase } from './UpdateProviderUseCase'

const providerRepository = new ProviderRepository()

const updateProviderUseCase = new UpdateProviderUseCase(providerRepository)

const updateProviderController = new UpdateProviderController(updateProviderUseCase)

export { updateProviderUseCase, updateProviderController }
