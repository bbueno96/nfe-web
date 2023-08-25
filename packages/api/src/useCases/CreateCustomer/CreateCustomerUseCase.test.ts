import { customerRepositoryMock } from '../../tests/mocks/repositories/CustomerRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateCustomerDTO } from './CreateCustomerDTO'
import { CreateCustomerUseCase } from './CreateCustomerUseCase'

const createCustomerUseCase = new CreateCustomerUseCase(customerRepositoryMock)

const customer = {
  cpfCnpj: '39728695000168',
  name: 'Empresa',
  email: 'empresa@empresa.com',
  phone: '24998156325',
  mobilePhone: '18952638596',
  dateCreated: new Date(),
  address: 'Rua teste',
  addressNumber: 'S/N',
  complement: ' ',
  province: 'centro',
  postalCode: '19010000',
  cityId: 1234,
  state: 'SP',
  companyId: '134',
  informarGTIN: false,
}

it('should sanitize create customer data', () => {
  createCustomerUseCase.sanitizeData(customer)

  expect(customer.cpfCnpj).toBe('39728695000168')
  expect(customer.name).toBe('Empresa')
  expect(customer.email).toBe('empresa@empresa.com')
  expect(customer.phone).toBe('24998156325')
  expect(customer.mobilePhone).toBe('18952638596')
})

it('should sanitize create customer empty data', () => {
  const customer = {} as ICreateCustomerDTO

  createCustomerUseCase.sanitizeData(customer)

  expect(customer.cpfCnpj).toBeUndefined()
  expect(customer.name).toBeUndefined()
  expect(customer.email).toBeUndefined()
  expect(customer.phone).toBeUndefined()
  expect(customer.mobilePhone).toBeUndefined()
})

/* it('should create a valid customer', async () => {
  expect.assertions(1)

  customerRepositoryMock.create.mockImplementationOnce(customer => Promise.resolve({ ...customer, id: '12345' }))
  const id = await createCustomerUseCase.execute(customer)

  expect(id).toBe('12345')
}) */

it('should not create customer with duplicated cpf cnpj', async () => {
  expect.assertions(2)
  customerRepositoryMock.hasCnpj.mockResolvedValueOnce(true)

  try {
    await createCustomerUseCase.execute(customer)
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError)
    expect(err.statusCode).toBe(409)
  }
})

it('should not create customer without cpf cnpj', async () => {
  expect.assertions(2)

  try {
    await createCustomerUseCase.execute({ ...customer, cpfCnpj: '' })
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError)
    expect(err.statusCode).toBe(422)
  }
})

it('should not create customer without name', async () => {
  expect.assertions(2)

  try {
    await createCustomerUseCase.execute({ ...customer, name: '' })
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError)
    expect(err.statusCode).toBe(422)
  }
})
