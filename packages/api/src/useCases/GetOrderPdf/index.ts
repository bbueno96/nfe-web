import { OrderProductsRepository } from '../../repositories/OrderProductsRepository'
import { OrderRepository } from '../../repositories/OrderRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { GetOrderPdfController } from './GetOrderPdfController'
import { GetOrderPdfUseCase } from './GetOrderPdfUseCase'

const orderRepository = new OrderRepository()
const parameterRepository = new ParameterRepository()
const orderProductsRepository = new OrderProductsRepository()
const getOrderPdfUseCase = new GetOrderPdfUseCase(orderRepository, parameterRepository, orderProductsRepository)

const getOrderPdfController = new GetOrderPdfController(getOrderPdfUseCase)

export { getOrderPdfUseCase, getOrderPdfController }
