import { ProviderRepository } from '../../repositories/ProviderRepository'
import { CreateProviderController } from './CreateProviderController'
import { CreateProviderUseCase } from './CreateProviderUseCase'

const providerRepository = new ProviderRepository()

const createProviderUseCase = new CreateProviderUseCase(providerRepository)

const createProviderController = new CreateProviderController(createProviderUseCase)

export { createProviderUseCase, createProviderController }
