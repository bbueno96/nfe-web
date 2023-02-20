import { ClassificationRepository } from '../../../repositories/ClassificationRepository'

export const classificationRepositoryMock: jest.Mocked<ClassificationRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  remove: jest.fn(),
}
