import { ProductRepository } from '../../../repositories/ProductRepository'

export const productRepositoryMock: jest.Mocked<ProductRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
}
