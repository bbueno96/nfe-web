import { BrandRepository } from '../../repositories/BrandRepository'
import { ListBrandController } from './ListBrandController'
import { ListBrandUseCase } from './ListBrandUseCase'

const brandRepository = new BrandRepository()
const listBrandUseCase = new ListBrandUseCase(brandRepository)

const listBrandController = new ListBrandController(listBrandUseCase)

export { listBrandUseCase, listBrandController }
