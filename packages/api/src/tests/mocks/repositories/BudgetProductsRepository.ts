import { BudgetProductsRepository } from '../../../repositories/BudgetProductsRepository'

export const budgetProductsRepositoryMock: jest.Mocked<BudgetProductsRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
  findByBudget: jest.fn(),
}
