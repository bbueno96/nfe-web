export interface IUpdateProductTaxDTO {
  id?: string
  product: string
  uf: string
  aliquotaIcms?: string
  cst?: number
  baseIcms?: string
  simplesNacional: boolean
  aliquotaIcmsSt?: string
  baseIcmsSt?: string
  mva?: string
  cfop: string
  cstPis?: string
  alqPis?: string
  cstCofins?: string
  alqCofins?: string
  ipi?: string
}
