import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { EmailNfeController } from './EmailNfeController'
import { EmailNfeUseCase } from './EmailNfeUseCase'

const nfeRepository = new NfeRepository()
const parameterRepository = new ParameterRepository()

const emailNfeUseCase = new EmailNfeUseCase(nfeRepository, parameterRepository)

const emailNfeController = new EmailNfeController(emailNfeUseCase)

export { emailNfeUseCase, emailNfeController }
