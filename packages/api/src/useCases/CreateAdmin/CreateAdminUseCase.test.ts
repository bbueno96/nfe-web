import { adminRepositoryMock } from '../../tests/mocks/repositories/AdminRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateAdminDTO } from './CreateAdminDTO'
import { CreateAdminUseCase } from './CreateAdminUseCase'

const createAdminUseCase = new CreateAdminUseCase(adminRepositoryMock)

const admin = {
  name: 'teste',
  login: 'teste1',
  passwordHash: '123aasda4',
  companyId: '1234',
}

describe('Create admin use case', () => {
  it('should sanitize create admin data', () => {
    createAdminUseCase.sanitizeData(admin)

    expect(admin.name).toBe('teste')
    expect(admin.login).toBe('teste1')
    expect(admin.passwordHash).toBe('123aasda4')
  })

  it('should sanitize create admin empty data', () => {
    const admin = {} as ICreateAdminDTO

    createAdminUseCase.sanitizeData(admin)

    expect(admin.name).toBeUndefined()
    expect(admin.companyId).toBeUndefined()
    expect(admin.passwordHash).toBeUndefined()
  })

  it('should create a valid admin', async () => {
    expect.assertions(1)

    const id = await createAdminUseCase.execute(admin)

    expect(id.length).toBe(36)
  })

  it('should not create admin without name', async () => {
    expect.assertions(2)

    try {
      await createAdminUseCase.execute({ ...admin, name: '' })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(422)
    }
  })
  it('should not create admin without login', async () => {
    expect.assertions(2)

    try {
      await createAdminUseCase.execute({ ...admin, login: '' })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(422)
    }
  })
  it('should not create admin without passwordHash', async () => {
    expect.assertions(2)

    try {
      await createAdminUseCase.execute({ ...admin, passwordHash: '' })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(422)
    }
  })
})
