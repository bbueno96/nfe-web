import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Nfe {
  id?: string
  cliente?: string
  razaoSocial: string
  endereco: string
  numero: string
  cidade: string
  estado: string
  bairro: string
  cep: string
  fornecedor?: string
  fone: string
  data: Date
  numeroNota?: number
  status: string
  tipo: string
  transpNome?: string
  volumes: Prisma.Decimal
  especie: string
  pesoBruto: Prisma.Decimal
  pesoLiquido: Prisma.Decimal
  frete?: Prisma.Decimal
  seguro?: Prisma.Decimal
  outrasDespesas?: Prisma.Decimal
  freteOutros?: Prisma.Decimal
  desconto?: Prisma.Decimal
  totalCheque?: Prisma.Decimal
  totalDinheiro?: Prisma.Decimal
  totalCartaoCredito?: Prisma.Decimal
  totalBoleto?: Prisma.Decimal
  totalOutros?: Prisma.Decimal
  totalCartaoDebito?: Prisma.Decimal
  totalNota: Prisma.Decimal
  totalProduto: Prisma.Decimal
  serie: number
  qtdePagina: number
  qtdeItens: number
  qtdeProdutos: number
  baseICMS: Prisma.Decimal
  valorICMS: Prisma.Decimal
  valorTributo: Prisma.Decimal
  rgIe: string
  cpfCnpj: string
  dataSaida?: Date
  dataOrigem?: Date
  estorno?: boolean
  complementar?: boolean
  dataAutorizacao?: Date
  naturezaOp: string
  tipoFrete: number
  transpCpfCnpj?: string
  transpRgIe?: string
  transpEndereco?: string
  transpEstado?: string
  transpCidade?: string
  observacoes?: string
  informacoesFisco?: string
  nfeRef?: number
  idCountry: number
  descCountry: string
  nDi?: string
  dDi?: Date
  xLocDesemb?: string
  uFDesemb?: string
  tpViaTransp?: number
  cExportador?: string
  sequencia?: number
  nomeLote?: string
  impressa?: boolean
  dataImpressao?: Date
  emailEnviado?: boolean
  cartaCorrecao?: string
  statuscartaCorrecao?: string
  nSeqEventos?: number
  reciboLote?: string
  chave?: string
  transportador?: string
  processado?: boolean
  erros?: string
  companyId: string
  paymentMethodId: string
  orderId?: string
  vIpi?: Prisma.Decimal
  vST?: Prisma.Decimal

  private constructor({
    cliente,
    razaoSocial,
    endereco,
    numero,
    cidade,
    estado,
    bairro,
    cep,
    fornecedor,
    fone,
    data,
    numeroNota,
    status,
    tipo,
    transpNome,
    volumes,
    especie,
    pesoBruto,
    pesoLiquido,
    frete,
    seguro,
    outrasDespesas,
    freteOutros,
    desconto,
    totalDinheiro,
    totalBoleto,
    totalOutros,
    totalNota,
    totalProduto,
    serie,
    qtdePagina,
    qtdeItens,
    qtdeProdutos,
    baseICMS,
    valorICMS,
    valorTributo,
    rgIe,
    cpfCnpj,
    estorno,
    complementar,
    naturezaOp,
    tipoFrete,
    observacoes,
    nfeRef,
    idCountry,
    descCountry,
    nDi,
    dDi,
    xLocDesemb,
    uFDesemb,
    tpViaTransp,
    cExportador,
    companyId,
    paymentMethodId,
    orderId,
    vIpi,
    vST,
  }: Nfe) {
    return Object.assign(this, {
      cliente,
      razaoSocial,
      endereco,
      numero,
      cidade,
      estado,
      bairro,
      cep,
      fornecedor,
      fone,
      data,
      numeroNota,
      status,
      tipo,
      transpNome,
      volumes,
      especie,
      pesoBruto,
      pesoLiquido,
      frete,
      seguro,
      outrasDespesas,
      freteOutros,
      desconto,
      totalDinheiro,
      totalBoleto,
      totalOutros,
      totalNota,
      totalProduto,
      serie,
      qtdePagina,
      qtdeItens,
      qtdeProdutos,
      baseICMS,
      valorICMS,
      valorTributo,
      rgIe,
      cpfCnpj,
      estorno,
      complementar,
      naturezaOp,
      tipoFrete,
      observacoes,
      nfeRef,
      idCountry,
      descCountry,
      nDi,
      dDi,
      xLocDesemb,
      uFDesemb,
      tpViaTransp,
      cExportador,
      companyId,
      paymentMethodId,
      orderId,
      vIpi,
      vST,
    })
  }

  static create(
    {
      cliente,
      razaoSocial,
      endereco,
      numero,
      cidade,
      estado,
      bairro,
      cep,
      fornecedor,
      fone,
      data,
      numeroNota,
      status,
      tipo,
      transpNome,
      volumes,
      especie,
      pesoBruto,
      pesoLiquido,
      frete,
      seguro,
      outrasDespesas,
      freteOutros,
      desconto,
      totalCartaoDebito,
      totalCheque,
      totalDinheiro,
      totalCartaoCredito,
      totalBoleto,
      totalOutros,
      totalNota,
      totalProduto,
      serie,
      qtdePagina,
      qtdeItens,
      qtdeProdutos,
      baseICMS,
      valorICMS,
      valorTributo,
      rgIe,
      cpfCnpj,
      estorno,
      complementar,
      naturezaOp,
      tipoFrete,
      observacoes,
      informacoesFisco,
      nfeRef,
      idCountry,
      descCountry,
      nDi,
      dDi,
      xLocDesemb,
      uFDesemb,
      tpViaTransp,
      companyId,
      paymentMethodId,
      orderId,
      vIpi,
      vST,
    }: Nfe,
    id?: string,
  ) {
    const nfe = new Nfe({
      cliente,
      razaoSocial,
      endereco,
      numero,
      cidade,
      estado,
      bairro,
      cep,
      fornecedor,
      fone,
      data,
      numeroNota,
      status,
      tipo,
      transpNome,
      volumes,
      especie,
      pesoBruto,
      pesoLiquido,
      frete,
      seguro,
      outrasDespesas,
      freteOutros,
      desconto,
      totalCheque,
      totalCartaoDebito,
      totalDinheiro,
      totalCartaoCredito,
      totalBoleto,
      totalOutros,
      totalNota,
      totalProduto,
      serie,
      qtdePagina,
      qtdeItens,
      qtdeProdutos,
      baseICMS,
      valorICMS,
      valorTributo,
      rgIe,
      cpfCnpj,
      estorno,
      complementar,
      naturezaOp,
      tipoFrete,
      observacoes,
      informacoesFisco,
      nfeRef,
      idCountry,
      descCountry,
      nDi,
      dDi,
      xLocDesemb,
      uFDesemb,
      tpViaTransp,
      companyId,
      paymentMethodId,
      orderId,
      vIpi,
      vST,
    })

    nfe.id = id || uuidv4()
    return nfe
  }
}

export { Nfe }
