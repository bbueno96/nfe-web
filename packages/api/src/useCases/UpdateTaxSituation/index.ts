import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { UpdateTaxSituationController } from './UpdateTaxSituationController'
import { UpdateTaxSituationUseCase } from './UpdateTaxSituationUseCase'

const taxSituationRepository = new TaxSituationsRepository()
const updateTaxSituationUseCase = new UpdateTaxSituationUseCase(taxSituationRepository)

const updateTaxSituationController = new UpdateTaxSituationController(updateTaxSituationUseCase)

export { updateTaxSituationUseCase, updateTaxSituationController }
