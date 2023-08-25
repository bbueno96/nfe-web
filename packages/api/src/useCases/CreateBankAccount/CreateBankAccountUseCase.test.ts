import { bankAccountRepositoryMock } from '../../tests/mocks/repositories/BankAccountRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateBankAccountDTO } from './CreateBankAccountDTO'
import { CreateBankAccountUseCase } from './CreateBankAccountUseCase'

const createBankAccountUseCase = new CreateBankAccountUseCase(bankAccountRepositoryMock)

const bankAccount = {
  description: 'Caixa AG12',
  institution: 756,
  number: 120,
  verifyingDigit: 9,
  agency: 40,
  companyId: '12321',
}

describe('Create bankAccount use case', () => {
  it('should sanitize create bankAccount data', () => {
    createBankAccountUseCase.sanitizeData(bankAccount)

    expect(bankAccount.description).toBe('Caixa AG12')
    expect(bankAccount.companyId).toBe('12321')
  })

  it('should sanitize create bankAccount empty data', () => {
    const bankAccount = {} as ICreateBankAccountDTO

    createBankAccountUseCase.sanitizeData(bankAccount)

    expect(bankAccount.description).toBeUndefined()
    expect(bankAccount.companyId).toBeUndefined()
  })

  /* it('should create a valid bankAccount', async () => {
    expect.assertions(1)
    bankAccountRepositoryMock.create.mockImplementationOnce(bankAccount =>
      Promise.resolve({ ...bankAccount, id: '12345' }),
    )
    const id = await createBankAccountUseCase.execute(bankAccount)

    expect(id).toBe('12345')
  }) */

  it('should not create bankAccount without description', async () => {
    expect.assertions(2)

    try {
      await createBankAccountUseCase.execute({ ...bankAccount, description: '' })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(422)
    }
  })
})
