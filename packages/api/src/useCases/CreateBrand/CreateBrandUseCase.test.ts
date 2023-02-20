import { brandRepositoryMock } from '../../tests/mocks/repositories/BrandRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateBrandDTO } from './CreateBrandDTO'
import { CreateBrandUseCase } from './CreateBrandUseCase'

const createBrandUseCase = new CreateBrandUseCase(brandRepositoryMock)

const brand = {
  description: 'Marca 1',
  companyId: '12321',
}

describe('Create brand use case', () => {
  it('should sanitize create brand data', () => {
    createBrandUseCase.sanitizeData(brand)

    expect(brand.description).toBe('Marca 1')
    expect(brand.companyId).toBe('12321')
  })

  it('should sanitize create brand empty data', () => {
    const brand = {} as ICreateBrandDTO

    createBrandUseCase.sanitizeData(brand)

    expect(brand.description).toBeUndefined()
    expect(brand.companyId).toBeUndefined()
  })

  it('should create a valid brand', async () => {
    expect.assertions(1)
    brandRepositoryMock.create.mockImplementationOnce(brand => Promise.resolve({ ...brand, id: '12345' }))
    const id = await createBrandUseCase.execute(brand)

    expect(id).toBe('12345')
  })

  it('should not create brand without description', async () => {
    expect.assertions(2)

    try {
      await createBrandUseCase.execute({ ...brand, description: '' })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(422)
    }
  })
})
