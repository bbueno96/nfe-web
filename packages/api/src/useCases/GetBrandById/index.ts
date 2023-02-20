import { BrandRepository } from '../../repositories/BrandRepository'
import { GetBrandByIdController } from './GetBrandByIdController'
import { GetBrandByIdUseCase } from './GetBrandByIdUseCase'

const brandRepository = new BrandRepository()
const getBrandByIdUseCase = new GetBrandByIdUseCase(brandRepository)

const getBrandByIdController = new GetBrandByIdController(getBrandByIdUseCase)

export { getBrandByIdUseCase, getBrandByIdController }
