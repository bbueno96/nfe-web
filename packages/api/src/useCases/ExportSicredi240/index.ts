import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ExportSicredi240Controller } from './ExportSicredi240Controller'
import { ExportSicredi240UseCase } from './ExportSicredi240UseCase'

const installmentRepository = new InstallmentRepository()
const customerRepository = new CustomerRepository()
const parameterRepository = new ParameterRepository()
const bankAccountRepository = new BankAccountRepository()
const exportSicredi240UseCase = new ExportSicredi240UseCase(
  installmentRepository,
  parameterRepository,
  customerRepository,
  bankAccountRepository,
)
const exportSicredi240Controller = new ExportSicredi240Controller(exportSicredi240UseCase)

export { exportSicredi240UseCase, exportSicredi240Controller }
