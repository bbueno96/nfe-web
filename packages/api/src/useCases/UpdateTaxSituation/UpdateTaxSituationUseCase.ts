import { Prisma } from '@prisma/client'

import { TaxSituationsRepository } from '../../repositories/TaxSituationsRepository'
import { ApiError } from '../../utils/ApiError'
import { IUpdateTaxSituationDTO } from './UpdateTaxSituationDTO'

export class UpdateTaxSituationUseCase {
  constructor(private taxSituationsRepository: TaxSituationsRepository) {}

  sanitizeData(data: IUpdateTaxSituationDTO) {
    data.description = data.description?.trim()
  }

  validate(data: IUpdateTaxSituationDTO) {
    if (!data.description) {
      throw new ApiError('O nome é obrigatório.', 422)
    }
  }

  async execute(data: IUpdateTaxSituationDTO) {
    const oldData = await this.taxSituationsRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Vendedor não encontrado.', 404)
    }

    this.sanitizeData(data)
    this.validate(data)

    await this.taxSituationsRepository.update({
      ...data,
      aliquotaIcms: new Prisma.Decimal(data.aliquotaIcms),
      baseIcms: new Prisma.Decimal(data.baseIcms),
      aliquotaIcmsSt: new Prisma.Decimal(data.aliquotaIcmsSt || 0),
      baseIcmsSt: new Prisma.Decimal(data.baseIcmsSt || 0),
      mva: new Prisma.Decimal(data.baseIcms || 0),
    })
  }
}
