import { NfeRepository } from '../../../repositories/NfeRepository'

export const nfeRepositoryMock: jest.Mocked<NfeRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
  getXmlNota: jest.fn(),
  createNfeStorage: jest.fn(),
  findNumeroNota: jest.fn(),
  findByIdP: jest.fn(),
  findByIdProducts: jest.fn(),
}
