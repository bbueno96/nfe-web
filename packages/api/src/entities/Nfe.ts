import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Nfe {
  id?: string
  cliente?: string | null
  razaoSocial?: string | null
  endereco?: string | null
  numero?: string | null
  cidade?: string | null
  estado?: string | null
  bairro?: string | null
  cep?: string | null
  fornecedor?: string | null
  fone?: string | null
  data: Date
  numeroNota?: number | null
  status: string
  tipo: string
  transpNome?: string | null
  volumes?: Prisma.Decimal | null
  especie?: string | null
  pesoBruto?: Prisma.Decimal | null
  pesoLiquido?: Prisma.Decimal | null
  frete?: Prisma.Decimal | null
  seguro?: Prisma.Decimal | null
  outrasDespesas?: Prisma.Decimal | null
  freteOutros?: Prisma.Decimal | null
  desconto?: Prisma.Decimal | null
  totalCheque?: Prisma.Decimal | null
  totalDinheiro?: Prisma.Decimal | null
  totalCartaoCredito?: Prisma.Decimal | null
  totalBoleto?: Prisma.Decimal | null
  totalOutros?: Prisma.Decimal | null
  totalCartaoDebito?: Prisma.Decimal | null
  totalNota?: Prisma.Decimal | null
  totalProduto?: Prisma.Decimal | null
  serie?: number | null
  qtdePagina?: number | null
  qtdeItens?: number | null
  qtdeProdutos?: number | null
  baseICMS: Prisma.Decimal
  valorICMS?: Prisma.Decimal | null
  valorTributo?: Prisma.Decimal | null
  rgIe?: string | null
  cpfCnpj?: string | null
  dataSaida: Date
  dataOrigem: Date
  estorno: boolean
  complementar: boolean
  dataAutorizacao: Date
  naturezaOp?: string | null
  tipoFrete?: number | null
  transpCpfCnpj?: string | null
  transpRgIe?: string | null
  transpEndereco?: string | null
  transpEstado?: string | null
  transpCidade?: string | null
  observacoes?: string | null
  informacoesFisco?: string | null
  nfeRef?: string | null
  idCountry?: number | null
  descCountry?: string | null
  nDi?: string | null
  dDi: Date
  xLocDesemb?: string | null
  uFDesemb?: string | null
  tpViaTransp?: number | null
  cExportador?: string | null
  sequencia?: number | null
  nomeLote?: string | null
  impressa: boolean
  dataImpressao: Date
  emailEnviado: boolean
  cartaCorrecao?: string | null
  statuscartaCorrecao?: string | null
  nSeqEventos?: number | null
  reciboLote?: string | null
  chave?: string | null
  transportador?: string | null
  processado: boolean
  erros?: string | null
  companyId?: string | null
  paymentMethodId?: string | null
  orderId?: string | null
  vIpi?: Prisma.Decimal | null
  vST?: Prisma.Decimal | null
  installments?: string | null
  paymentMean?: number | null
  placaTransp?: string | null
  ufTransp?: string | null
  rntrcTransp?: string | null
  propertyId?: string | null
  customerApoioProperty?: string | null
  email?: string | null
  documentType?: number | null
  taxpayerType?: number | null

  constructor(props: Omit<Nfe, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.cliente = props.cliente
    this.razaoSocial = props.razaoSocial
    this.endereco = props.endereco
    this.numero = props.numero
    this.cidade = props.cidade
    this.estado = props.estado
    this.bairro = props.bairro
    this.cep = props.cep
    this.fornecedor = props.fornecedor
    this.fone = props.fone
    this.data = props.data
    this.numeroNota = props.numeroNota
    this.status = props.status
    this.tipo = props.tipo
    this.transpNome = props.transpNome
    this.volumes = new Prisma.Decimal(props.volumes || 0)
    this.especie = props.especie
    this.pesoBruto = new Prisma.Decimal(props.pesoBruto || 0)
    this.pesoLiquido = new Prisma.Decimal(props.pesoLiquido || 0)
    this.frete = new Prisma.Decimal(props.frete || 0)
    this.seguro = new Prisma.Decimal(props.seguro || 0)
    this.outrasDespesas = new Prisma.Decimal(props.outrasDespesas || 0)
    this.freteOutros = new Prisma.Decimal(props.freteOutros || 0)
    this.desconto = new Prisma.Decimal(props.desconto || 0)
    this.totalDinheiro = new Prisma.Decimal(props.totalDinheiro || 0)
    this.totalBoleto = new Prisma.Decimal(props.totalBoleto || 0)
    this.totalOutros = new Prisma.Decimal(props.totalOutros || 0)
    this.totalNota = new Prisma.Decimal(props.totalNota || 0)
    this.totalProduto = new Prisma.Decimal(props.totalProduto || 0)
    this.serie = props.serie
    this.qtdePagina = props.qtdePagina
    this.qtdeItens = props.qtdeItens
    this.qtdeProdutos = props.qtdeProdutos
    this.baseICMS = new Prisma.Decimal(props.baseICMS || 0)
    this.valorICMS = new Prisma.Decimal(props.valorICMS || 0)
    this.valorTributo = new Prisma.Decimal(props.valorTributo || 0)
    this.rgIe = props.rgIe
    this.cpfCnpj = props.cpfCnpj
    this.estorno = props.estorno
    this.complementar = props.complementar
    this.naturezaOp = props.naturezaOp
    this.tipoFrete = props.tipoFrete
    this.observacoes = props.observacoes
    this.nfeRef = props.nfeRef
    this.idCountry = props.idCountry
    this.descCountry = props.descCountry
    this.nDi = props.nDi
    this.dDi = props.dDi
    this.xLocDesemb = props.xLocDesemb
    this.uFDesemb = props.uFDesemb
    this.tpViaTransp = props.tpViaTransp
    this.cExportador = props.cExportador
    this.companyId = props.companyId
    this.paymentMethodId = props.paymentMethodId
    this.orderId = props.orderId
    this.vIpi = new Prisma.Decimal(props.vIpi || 0)
    this.vST = new Prisma.Decimal(props.vST || 0)
    this.installments = props.installments
    this.paymentMean = props.paymentMean
    this.placaTransp = props.placaTransp
    this.ufTransp = props.ufTransp
    this.rntrcTransp = props.rntrcTransp
    this.propertyId = props.propertyId
    this.customerApoioProperty = props.customerApoioProperty
    this.email = props.email
    this.documentType = props.documentType
    this.taxpayerType = props.taxpayerType
    this.dataAutorizacao = props.dataAutorizacao
    this.dataSaida = props.dataSaida
    this.dataOrigem = props.dataOrigem
  }
}

export { Nfe }
