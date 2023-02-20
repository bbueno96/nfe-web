import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { GetTaxSituationByIdController } from './GetTaxSituationByIdController'
import { GetTaxSituationByIdUseCase } from './GetTaxSituationByIdUseCase'

const taxSituationRepository = new TaxSituationsRepository()
const getTaxSituationByIdUseCase = new GetTaxSituationByIdUseCase(taxSituationRepository)

const getTaxSituationByIdController = new GetTaxSituationByIdController(getTaxSituationByIdUseCase)

export { getTaxSituationByIdUseCase, getTaxSituationByIdController }
