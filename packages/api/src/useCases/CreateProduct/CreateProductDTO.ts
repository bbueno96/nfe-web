export interface ICreateProductDTO {
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
  und: string
  barCode: string
  disableAt?: Date
  ncm: string
  weight: number
  height: number
  width: number
  length: number
  color: string
  size: number
  companyId: string
  cf?: number
  cod?: string
}
