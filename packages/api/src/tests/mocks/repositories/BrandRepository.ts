import { BrandRepository } from '../../../repositories/BrandRepository'

export const brandRepositoryMock: jest.Mocked<BrandRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
}
