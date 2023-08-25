import { customerRepositoryMock } from '../../tests/mocks/repositories/CustomerRepository'
import { ApiError } from '../../utils/ApiError'
import { RemoveCustomerUseCase } from './RemoveCustomerUseCase'

const getCustomerByIdUseCase = new RemoveCustomerUseCase(customerRepositoryMock)

describe('Get customer by id use case', () => {
  /* it('should get customer id', async () => {
    expect.assertions(2)
    customerRepositoryMock.findById.mockResolvedValueOnce({
      id: '12345',
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
      postalCode: '19045000',
      cityId: 134,
      state: 'SP',
      companyId: '321',
      informarGTIN: false,
    })
    customerRepositoryMock.remove.mockResolvedValueOnce()
    const customer = await getCustomerByIdUseCase.execute('12345')
    expect(customer).toBeDefined()
    expect(customer.id).toBe('12345')
  })
*/
  it('should not get point of sale by id', async () => {
    expect.assertions(2)
    customerRepositoryMock.findById.mockResolvedValueOnce(null)

    try {
      await getCustomerByIdUseCase.execute('12345')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect(err.statusCode).toBe(404)
    }
  })
})
