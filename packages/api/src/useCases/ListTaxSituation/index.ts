import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ListTaxSituationController } from './ListTaxSituationController'
import { ListTaxSituationUseCase } from './ListTaxSituationUseCase'

const taxSituationsRepository = new TaxSituationsRepository()
const listTaxSituationUseCase = new ListTaxSituationUseCase(taxSituationsRepository)

const listTaxSituationController = new ListTaxSituationController(listTaxSituationUseCase)

export { listTaxSituationUseCase, listTaxSituationController }
