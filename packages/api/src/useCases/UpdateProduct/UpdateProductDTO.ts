export interface IUpdateProductDTO {
  id?: string | null
  group?: string | null
  brand?: string | null
  description: string
  stock: number
  stockMinium?: number
  value: number
  valueOld: number
  purchaseValue: number
  lastPurchase?: Date
  lastSale?: Date
  createAt: Date
  st: string
  und: string
  barCode: string
  ipi: number
  disableAt?: Date
  ncm: string
  cfop: string
  pisCofins: boolean
  weight: number
  height: number
  width: number
  length: number
  color: string
  size: number
  companyId: string
  cstPis?: string
  alqPis?: number
  cstCofins?: string
  alqCofins?: number
  cf?: number
  cod?: string
}
