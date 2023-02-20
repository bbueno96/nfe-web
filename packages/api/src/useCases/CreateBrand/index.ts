import { BrandRepository } from '../../repositories/BrandRepository'
import { CreateBrandController } from './CreateBrandController'
import { CreateBrandUseCase } from './CreateBrandUseCase'

const brandRepository = new BrandRepository()

const createBrandUseCase = new CreateBrandUseCase(brandRepository)

const createBrandController = new CreateBrandController(createBrandUseCase)

export { createBrandUseCase, createBrandController }
