import { CustomerRepository } from '../../repositories/CustomerRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { SendAuthNfeController } from './SendAuthNfeController'
import { SendAuthNfeUseCase } from './SendAuthNfeUseCase'

const nfeRepository = new NfeRepository()
const customerRepository = new CustomerRepository()
const parameterRepository = new ParameterRepository()

const sendAuthNfeUseCase = new SendAuthNfeUseCase(nfeRepository, customerRepository, parameterRepository)

const sendAuthNfeController = new SendAuthNfeController(sendAuthNfeUseCase)

export { sendAuthNfeUseCase, sendAuthNfeController }
