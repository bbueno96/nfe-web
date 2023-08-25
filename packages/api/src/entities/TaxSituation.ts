import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class TaxSituation {
  id?: string
  description: string
  aliquotaIcms?: Prisma.Decimal | null
  cst?: number | null
  baseIcms?: Prisma.Decimal | null
  simplesNacional: boolean
  aliquotaIcmsSt?: Prisma.Decimal | null
  baseIcmsSt?: Prisma.Decimal | null
  mva?: Prisma.Decimal | null
  companyId: string
  cfopState?: string | null
  cfopInter?: string | null
  cfopStatePf?: string | null
  cfopInterPf?: string | null

  constructor(props: Omit<TaxSituation, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.description = props.description
    this.aliquotaIcms = props.aliquotaIcms
    this.aliquotaIcmsSt = props.aliquotaIcmsSt
    this.baseIcms = props.baseIcms
    this.baseIcmsSt = props.baseIcmsSt
    this.cst = props.cst
    this.simplesNacional = props.simplesNacional
    this.mva = props.mva
    this.companyId = props.companyId
    this.cfopState = props.cfopState
    this.cfopInter = props.cfopInter
    this.cfopStatePf = props.cfopStatePf
    this.cfopInterPf = props.cfopInterPf
  }
}

export { TaxSituation }
