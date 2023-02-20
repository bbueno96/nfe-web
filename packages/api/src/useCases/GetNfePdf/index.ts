import { NfeRepository } from '../../repositories/NfeRepository'
import { GetNfePdfController } from './GetNfePdfController'
import { GetNfePdfUseCase } from './GetNfePdfUseCase'

const nfeRepository = new NfeRepository()
const getNfePdfUseCase = new GetNfePdfUseCase(nfeRepository)

const getNfePdfController = new GetNfePdfController(getNfePdfUseCase)

export { getNfePdfUseCase, getNfePdfController }
