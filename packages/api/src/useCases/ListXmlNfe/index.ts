import { NfeRepository } from '../../repositories/NfeRepository'
import { ListXmlNfeController } from './ListXmlNfeController'
import { ListXmlNfeUseCase } from './ListXmlNfeUseCase'

const nfeRepository = new NfeRepository()
const listXmlNfeUseCase = new ListXmlNfeUseCase(nfeRepository)

const listXmlNfeController = new ListXmlNfeController(listXmlNfeUseCase)

export { listXmlNfeUseCase, listXmlNfeController }
