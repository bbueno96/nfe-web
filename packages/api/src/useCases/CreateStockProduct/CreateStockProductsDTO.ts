/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICreateStockProductsDTO {
  createdAt: Date
  typeGenerate: number
  amount: number
  productId: string
  numeroDoc: string
  type: string
  companyId?: string
  employeeId?: string
}
