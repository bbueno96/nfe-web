import { CustomerRepository } from '../../repositories/CustomerRepository'
import { ListCustomersController } from './ListCustomersController'
import { ListCustomersUseCase } from './ListCustomersUseCase'

const customerRepository = new CustomerRepository()
const listCustomersUseCase = new ListCustomersUseCase(customerRepository)

const listCustomersController = new ListCustomersController(listCustomersUseCase)

export { listCustomersUseCase, listCustomersController }
