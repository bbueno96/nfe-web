import { Customer } from '../../entities/Customer'
import { NfeProducts } from '../../entities/NfeProducts'

export interface ICreateNfeDTO {
  id?: string
  cliente: string
  fornecedor?: string
  data: Date
  numeroNota: number
  tipo: string
  transpNome?: string
  frete: number
  seguro: number
  outrasDespesas: number
  freteOutros: number
  desconto: number
  totalCheque?: number
  totalDinheiro: number
  totalCartaoCredito?: number
  totalBoleto?: number
  totalOutros?: number
  totalCartaoDebito?: number
  totalNota?: number
  totalProduto?: number
  serie: number
  estorno?: boolean
  complementar?: boolean
  naturezaOp: string
  observacoes?: string
  idCountry: number
  descCountry: string
  nDi?: string
  dDi?: Date
  xLocDesemb?: string
  uFDesemb?: string
  tpViaTransp?: number
  cExportador?: string
  transportador?: string
  erros?: string
  products: NfeProducts[]
  companyId: string
  paymentMethodId: string
  Customer?: Customer
  orderId?: string
  customerApoioId?: string
  customerApoioName?: string
  cpfCnpjApoio?: string
  employeeId: string
  placaTransp?: string
  ufTransp?: string
  rntrcTransp?: string
  transpCpfCnpj?: string
  transpEndereco?: string
  transpEstado?: string
  tranpCidade?: string
  installments?: string
  paymentMean?: number
  bankAccountId: string
  wallet?: number
  propertyId?: string
  customerApoioProperty?: string
}
