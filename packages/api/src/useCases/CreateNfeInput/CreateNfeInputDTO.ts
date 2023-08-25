import { AccountPayable } from '../../entities/AccountPayable'
import { NfeProducts } from '../../entities/NfeProducts'
import { Provider } from '../../entities/Provider'

export interface ICreateNfeInputDTO {
  id?: string
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
  Fornecedor?: Provider
  installments?: AccountPayable[]
  especie?: string
  pesoBruto?: number
  pesoLiquido?: number
  baseICMS?: number
  valorICMS?: number
  valorTributo?: number
  dataSaida?: Date
  vIpi?: number
  vST?: number
  employeeId: string
  paymentMean?: number
  wallet?: number
}
