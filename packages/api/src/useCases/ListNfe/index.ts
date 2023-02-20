import { NfeRepository } from '../../repositories/NfeRepository'
import { ListNfeController } from './ListNfeController'
import { ListNfeUseCase } from './ListNfeUseCase'

const nfeRepository = new NfeRepository()
const listNfeUseCase = new ListNfeUseCase(nfeRepository)

const listNfeController = new ListNfeController(listNfeUseCase)

export { listNfeUseCase, listNfeController }
