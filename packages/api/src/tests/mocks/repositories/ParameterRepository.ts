import { ParameterRepository } from '../../../repositories/ParameterRepository'

export const parameterRepositoryMock: jest.Mocked<ParameterRepository> = {
  update: jest.fn(),
  getParameter: jest.fn(),
  lastNumeroNota: jest.fn(),
  lastBudget: jest.fn(),
  lastOrder: jest.fn(),
}
