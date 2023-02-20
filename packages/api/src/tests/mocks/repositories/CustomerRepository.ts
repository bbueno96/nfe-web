import { CustomerRepository } from '../../../repositories/CustomerRepository'

export const customerRepositoryMock: jest.Mocked<CustomerRepository> = {
  hasCnpj: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
}
