import { AdminRepository } from '../../../repositories/AdminRepository'

export const adminRepositoryMock: jest.Mocked<AdminRepository> = {
  findByLogin: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  remove: jest.fn(),
  list: jest.fn(),
}
