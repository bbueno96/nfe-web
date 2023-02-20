import { CustomerRepository } from '../../repositories/CustomerRepository'
import { UpdateCustomerController } from './UpdateCustomerController'
import { UpdateCustomerUseCase } from './UpdateCustomerUseCase'

const customerRepository = new CustomerRepository()

const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository)

const updateCustomerController = new UpdateCustomerController(updateCustomerUseCase)

export { updateCustomerUseCase, updateCustomerController }
