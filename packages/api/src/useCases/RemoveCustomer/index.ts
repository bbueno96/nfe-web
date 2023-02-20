import { CustomerRepository } from '../../repositories/CustomerRepository'
import { RemoveCustomerController } from './RemoveCustomerController'
import { RemoveCustomerUseCase } from './RemoveCustomerUseCase'

const customerRepository = new CustomerRepository()
const removeCustomerUseCase = new RemoveCustomerUseCase(customerRepository)

const removeCustomerController = new RemoveCustomerController(removeCustomerUseCase)

export { removeCustomerUseCase, removeCustomerController }
