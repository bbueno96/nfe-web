import { OrderProductsRepository } from '../../../repositories/OrderProductsRepository'

export const orderProductsRepositoryMock: jest.Mocked<OrderProductsRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
  findByOrder: jest.fn(),
}
