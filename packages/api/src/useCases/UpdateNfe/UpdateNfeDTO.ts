import { Customer } from '../../entities/Customer'
import { NfeProducts } from '../../entities/NfeProducts'

export interface IUpdateNfeDTO {
  id?: string
  cliente: string
  fornecedor?: string
  data: Date
  tipo: string
  transpNome?: string
  frete: number
  seguro: number
  placaTransp?: string
  ufTransp?: string
  rntrcTransp?: string
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
  nfeRef?: string
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
  volumes?: number
  especie?: string
  companyId: string
  paymentMethodId: string
  Customer?: Customer
  orderId?: string
  customerApoioId?: string
  customerApoioName?: string
  cpfCnpjApoio?: string
  employeeId: string
  installments?: string
  paymentMean?: number
  reciboLote?: string
  propertyId?: string
  customerApoioProperty?: string
  pesoBruto?: number
  pesoLiquido?: number
  tipoFrete?: number | null
}
