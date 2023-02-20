import { OrderRepository } from '../../../repositories/OrderRepository'

export const orderRepositoryMock: jest.Mocked<OrderRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
  hasNfeAuth: jest.fn(),
}
