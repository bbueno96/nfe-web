import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { CreateTaxSituationController } from './CreateTaxSituationController'
import { CreateTaxSituationUseCase } from './CreateTaxSituationUseCase'

const taxSituationRepository = new TaxSituationsRepository()

const createTaxSituationUseCase = new CreateTaxSituationUseCase(taxSituationRepository)

const createTaxSituationController = new CreateTaxSituationController(createTaxSituationUseCase)

export { createTaxSituationUseCase, createTaxSituationController }
