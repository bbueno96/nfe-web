import { NfeRepository } from '../../repositories/NfeRepository'
import { ParameterRepository } from '../../repositories/ParameterRepository'
import { CartaCorrecaoNfeController } from './CartaCorrecaoNfeController'
import { CartaCorrecaoNfeUseCase } from './CartaCorrecaoNfeUseCase'

const nfeRepository = new NfeRepository()
const parameterRepository = new ParameterRepository()

const cartaNfeUseCase = new CartaCorrecaoNfeUseCase(nfeRepository, parameterRepository)

const cartaNfeController = new CartaCorrecaoNfeController(cartaNfeUseCase)

export { cartaNfeUseCase, cartaNfeController }
