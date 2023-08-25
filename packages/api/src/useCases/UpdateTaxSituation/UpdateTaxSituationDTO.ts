export interface IUpdateTaxSituationDTO {
  id: string
  aliquotaIcms: number
  description: string
  cst?: number
  baseIcms?: number
  simplesNacional: boolean
  aliquotaIcmsSt?: number
  baseIcmsSt?: number
  mva?: number
  companyId: string
  cfopState?: string
  cfopInter?: string
  cfopStatePf?: string
  cfopInterPf?: string
}
