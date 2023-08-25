import { CustomerRepository } from '../../repositories/CustomerRepository'
import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { PreDanfeNfeController } from './PreDanfeNfeController'
import { PreDanfeNfeUseCase } from './PreDanfeNfeUseCase'

const nfeRepository = new NfeRepository()
const customerRepository = new CustomerRepository()
const parameterRepository = new ParameterRepository()

const preDanfeNfeUseCase = new PreDanfeNfeUseCase(nfeRepository, customerRepository, parameterRepository)

const preDanfeNfeController = new PreDanfeNfeController(preDanfeNfeUseCase)

export { preDanfeNfeUseCase, preDanfeNfeController }
