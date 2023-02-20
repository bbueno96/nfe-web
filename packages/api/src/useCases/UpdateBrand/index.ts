import { BrandRepository } from '../../repositories/BrandRepository'
import { UpdateBrandController } from './UpdateBrandController'
import { UpdateBrandUseCase } from './UpdateBrandUseCase'

const brandRepository = new BrandRepository()
const updateBrandUseCase = new UpdateBrandUseCase(brandRepository)

const updateBrandController = new UpdateBrandController(updateBrandUseCase)

export { updateBrandUseCase, updateBrandController }
