export interface ICreateOrderDTO {
  numberOrder: number
  createdAt: Date
  status: number
  discount: number
  total: number
  customerId?: string
  shipping: number
  employeeId: string
  companyId: string
  products: any[]
  obs?: string
  payMethodId?: string
  Customer?: any
  budgetId?: string
  customerApoioId?: string
  customerApoioName?: string
}
