import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class TaxSituation {
  id?: string
  description: string
  aliquotaIcms: Prisma.Decimal
  cst?: number
  baseIcms?: Prisma.Decimal
  simplesNacional: boolean
  aliquotaIcmsSt?: Prisma.Decimal
  baseIcmsSt?: Prisma.Decimal
  mva?: Prisma.Decimal
  companyId: string
  cfopState?: string
  cfopInter?: string
  cfopStatePf?: string
  cfopInterPf?: string

  private constructor({
    description,
    aliquotaIcms,
    cst,
    simplesNacional,
    companyId,
    cfopState,
    cfopInter,
    cfopStatePf,
    cfopInterPf,
  }: TaxSituation) {
    return Object.assign(this, {
      description,
      aliquotaIcms,
      cst,
      simplesNacional,
      companyId,
      cfopState,
      cfopInter,
      cfopStatePf,
      cfopInterPf,
    })
  }

  static create({
    description,
    aliquotaIcms,
    cst,
    simplesNacional,
    companyId,
    cfopState,
    cfopInter,
    cfopStatePf,
    cfopInterPf,
  }: TaxSituation) {
    const taxSituation = new TaxSituation({
      description,
      aliquotaIcms,
      cst,
      simplesNacional,
      companyId,
      cfopState,
      cfopInter,
      cfopStatePf,
      cfopInterPf,
    })

    taxSituation.id = uuidv4()

    return taxSituation
  }
}

export { TaxSituation }
