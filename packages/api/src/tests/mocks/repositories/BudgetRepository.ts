import { BudgetRepository } from '../../../repositories/BudgetRepository'

export const budgetRepositoryMock: jest.Mocked<BudgetRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
  hasOrderConfirmed: jest.fn(),
}
