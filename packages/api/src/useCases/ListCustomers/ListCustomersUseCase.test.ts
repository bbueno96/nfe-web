import { customerRepositoryMock } from '../../tests/mocks/repositories/CustomerRepository'
import { ListCustomersUseCase } from './ListCustomersUseCase'

const listCustomersUseCase = new ListCustomersUseCase(customerRepositoryMock)

describe('List customers use case', () => {
  it('should list customers', async () => {
    expect.assertions(2)

    customerRepositoryMock.list.mockResolvedValueOnce({
      items: [],
      pager: { page: 1, perPage: 10, pages: 1, records: 0 },
    })

    const response = await listCustomersUseCase.execute({})

    expect(response).toHaveProperty('items')
    expect(response).toHaveProperty('pager')
  })
})
