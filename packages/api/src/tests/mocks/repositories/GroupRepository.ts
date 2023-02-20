import { GroupRepository } from '../../../repositories/GroupRepository'

export const groupRepositoryMock: jest.Mocked<GroupRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
}
