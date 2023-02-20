import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { CreateInstallmentController } from './CreateInstallmentController'
import { CreateInstallmentUseCase } from './CreateInstallmentUseCase'

const installmentRepository = new InstallmentRepository()
const bankAccountRepository = new BankAccountRepository()
const parameterRepository = new ParameterRepository()
const customerRepository = new CustomerRepository()

const createInstallmentUseCase = new CreateInstallmentUseCase(
  installmentRepository,
  bankAccountRepository,
  parameterRepository,
  customerRepository,
)

const createInstallmentController = new CreateInstallmentController(createInstallmentUseCase)

export { createInstallmentUseCase, createInstallmentController }
