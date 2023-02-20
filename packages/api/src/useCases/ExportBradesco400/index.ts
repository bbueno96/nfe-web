import { BankAccountRepository } from '../../repositories/BankAccountRepository'
import { CustomerRepository } from '../../repositories/CustomerRepository'
import { InstallmentRepository } from '../../repositories/InstallmentRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { ExportBradesco400Controller } from './ExportBradesco400Controller'
import { ExportBradesco400UseCase } from './ExportBradesco400UseCase'

const installmentRepository = new InstallmentRepository()
const customerRepository = new CustomerRepository()
const parameterRepository = new ParameterRepository()
const bankAccountRepository = new BankAccountRepository()
const exportBradesco400UseCase = new ExportBradesco400UseCase(
  installmentRepository,
  parameterRepository,
  customerRepository,
  bankAccountRepository,
)
const exportBradesco400Controller = new ExportBradesco400Controller(exportBradesco400UseCase)

export { exportBradesco400UseCase, exportBradesco400Controller }
