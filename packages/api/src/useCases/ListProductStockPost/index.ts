import { StockProductsRepository } from '../../repositories/StockProductsRepository'
import { ListProductStockPostController } from './ListProductStockPostController'
import { ListProductStockPostUseCase } from './ListProductStockPostUseCase'

const stockProductsRepository = new StockProductsRepository()
const listProductStockPostUseCase = new ListProductStockPostUseCase(stockProductsRepository)

const listProductStockPostController = new ListProductStockPostController(listProductStockPostUseCase)

export { listProductStockPostUseCase, listProductStockPostController }
