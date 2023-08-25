import { Prisma } from '@prisma/client'

import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ApiError } from '../../utils/ApiError'
import { ICreateTaxSituationDTO } from './CreateTaxSituationDTO'

export class CreateTaxSituationUseCase {
  constructor(private taxSituationRepository: TaxSituationsRepository) {}

  sanitizeData(data: ICreateTaxSituationDTO) {
    data.description = data.description?.trim()
  }

  validate(data: ICreateTaxSituationDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: ICreateTaxSituationDTO) {
    this.sanitizeData(data)
    await this.validate(data)

    const taxSituation = await this.taxSituationRepository.create({
      ...data,
      aliquotaIcms: new Prisma.Decimal(data.aliquotaIcms),
      baseIcms: new Prisma.Decimal(data.baseIcms || 0),
      aliquotaIcmsSt: null,
      baseIcmsSt: null,
      mva: null,
    })
    return taxSituation.id
  }
}
