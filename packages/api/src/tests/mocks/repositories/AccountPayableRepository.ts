import { BankAccountRepository } from '../../../repositories/BankAccountRepository'

export const accountPayableRepositoryMock: jest.Mocked<BankAccountRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
}
