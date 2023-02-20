import { TaxSituationsRepository } from '../../../repositories/TaxSituationsRepository'

export const taxSituationsRepositoryMock: jest.Mocked<TaxSituationsRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  listPost: jest.fn(),
  remove: jest.fn(),
  findCestByNcm: jest.fn(),
  findIbptByNcm: jest.fn(),
  findByProvider: jest.fn(),
}
