import { CustomerRepository } from '../../repositories/CustomerRepository'
import { GetCustomerByIdController } from './GetCustomerByIdController'
import { GetCustomerByIdUseCase } from './GetCustomerByIdUseCase'

const customerRepository = new CustomerRepository()
const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository)

const getCustomerByIdController = new GetCustomerByIdController(getCustomerByIdUseCase)

export { getCustomerByIdUseCase, getCustomerByIdController }
