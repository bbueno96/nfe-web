import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ListTaxSituationPostController } from './ListTaxSituationPostController'
import { ListTaxSituationPostUseCase } from './ListTaxSituationPostUseCase'

const taxSituationsRepository = new TaxSituationsRepository()
const listTaxSituationPostUseCase = new ListTaxSituationPostUseCase(taxSituationsRepository)

const listTaxSituationPostController = new ListTaxSituationPostController(listTaxSituationPostUseCase)

export { listTaxSituationPostUseCase, listTaxSituationPostController }
