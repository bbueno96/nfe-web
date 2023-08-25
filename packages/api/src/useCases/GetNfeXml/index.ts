import { NfeRepository } from '../../repositories/NfeRepository'
import { GetNfeXmlController } from './GetNfeXmlController'
import { GetNfeXmlUseCase } from './GetNfeXmlUseCase'

const nfeRepository = new NfeRepository()
const getNfeXmlUseCase = new GetNfeXmlUseCase(nfeRepository)

const getNfeXmlController = new GetNfeXmlController(getNfeXmlUseCase)

export { getNfeXmlUseCase, getNfeXmlController }
