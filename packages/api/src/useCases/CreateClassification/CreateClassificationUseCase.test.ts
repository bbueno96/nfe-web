import { classificationRepositoryMock } from '../../tests/mocks/repositories/ClassificationRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateClassificationDTO } from './CreateClassificationDTO'
import { CreateClassificationUseCase } from './CreateClassificationUseCase'

const createClassificationUseCase = new CreateClassificationUseCase(classificationRepositoryMock)

const classification = {
  description: 'Receitas',
  code: '1',
  isGroup: false,
  companyId: '12321',
}

describe('Create classification use case', () => {
  it('should sanitize create classification data', () => {
    createClassificationUseCase.sanitizeData(classification)

    expect(classification.description).toBe('Receitas')
    expect(classification.companyId).toBe('12321')
  })

  it('should sanitize create classification empty data', () => {
    const classification = {} as ICreateClassificationDTO

    createClassificationUseCase.sanitizeData(classification)

    expect(classification.description).toBeUndefined()
    expect(classification.companyId).toBeUndefined()
  })

  it('should create a valid classification', async () => {
    expect.assertions(1)
    classificationRepositoryMock.create.mockImplementationOnce(classification =>
      Promise.resolve({ ...classification, id: '12345' }),
    )
    const id = await createClassificationUseCase.execute(classification)

    expect(id).toBe('12345')
  })

  it('should not create classification without description', async () => {
    expect.assertions(2)

    try {
      await createClassificationUseCase.execute({ ...classification, description: '' })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(422)
    }
  })
})
