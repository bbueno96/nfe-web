import { ProductRepository } from '../../repositories/ProductRepository'
import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { CreateStockProductsController } from './CreateStockProductsController'
import { CreateStockProductsUseCase } from './CreateStockProductsUseCase'

const productRepository = new ProductRepository()
const stockProductsRepository = new StockProductsRepository()
const createStockProductsUseCase = new CreateStockProductsUseCase(stockProductsRepository, productRepository)

const createStockProductsController = new CreateStockProductsController(createStockProductsUseCase)

export { createStockProductsUseCase, createStockProductsController }
