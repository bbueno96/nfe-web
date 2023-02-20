import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ApiError } from '../../utils/ApiError'

export class GetTaxSituationByIdUseCase {
  constructor(private taxSituationsRepository: TaxSituationsRepository) {}

  async execute(id: string) {
    const taxSituation = await this.taxSituationsRepository.findById(id)

    if (!taxSituation) {
      throw new ApiError('Nenhuma situação tributaria encontrada encontrado.', 404)
    }

    return taxSituation
  }
}
