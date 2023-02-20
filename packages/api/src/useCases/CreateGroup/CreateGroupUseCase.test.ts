import { groupRepositoryMock } from '../../tests/mocks/repositories/GroupRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateGroupDTO } from './CreateGroupDTO'
import { CreateGroupUseCase } from './CreateGroupUseCase'

const createGroupUseCase = new CreateGroupUseCase(groupRepositoryMock)

const group = {
  description: 'Grupo 1',
  companyId: '12321',
}

describe('Create group use case', () => {
  it('should sanitize create group data', () => {
    createGroupUseCase.sanitizeData(group)

    expect(group.description).toBe('Grupo 1')
    expect(group.companyId).toBe('12321')
  })

  it('should sanitize create group empty data', () => {
    const group = {} as ICreateGroupDTO

    createGroupUseCase.sanitizeData(group)

    expect(group.description).toBeUndefined()
    expect(group.companyId).toBeUndefined()
  })

  it('should create a valid group', async () => {
    expect.assertions(1)
    groupRepositoryMock.create.mockImplementationOnce(group => Promise.resolve({ ...group, id: '12345' }))
    const id = await createGroupUseCase.execute(group)

    expect(id).toBe('12345')
  })

  it('should not create group without description', async () => {
    expect.assertions(2)

    try {
      await createGroupUseCase.execute({ ...group, description: '' })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(422)
    }
  })
})
