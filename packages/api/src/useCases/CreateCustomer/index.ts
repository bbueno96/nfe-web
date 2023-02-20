import { CustomerRepository } from '../../repositories/CustomerRepository'
import { CreateCustomerController } from './CreateCustomerController'
import { CreateCustomerUseCase } from './CreateCustomerUseCase'

const customerRepository = new CustomerRepository()

const createCustomerUseCase = new CreateCustomerUseCase(customerRepository)

const createCustomerController = new CreateCustomerController(createCustomerUseCase)

export { createCustomerUseCase, createCustomerController }
