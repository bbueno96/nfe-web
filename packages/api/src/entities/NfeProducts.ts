import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class NfeProducts {
  id?: string
  nota: string
  produto: string
  descricao: string
  cfop: string
  ncm: string
  quantidade: Prisma.Decimal
  unitario: Prisma.Decimal
  total: Prisma.Decimal
  st?: number
  stNfe?: string
  cf?: number
  baseICMS?: Prisma.Decimal
  valorICMS?: Prisma.Decimal
  aliquotaICMS?: Prisma.Decimal
  baseTributo?: Prisma.Decimal
  refProduto?: string
  cest?: string
  baseIcmsSt?: Prisma.Decimal
  valorIcmsSt?: Prisma.Decimal
  aliquotaIcmsSt?: Prisma.Decimal
  mva?: Prisma.Decimal
  unidade: string
  companyId: string
  pisCofins: boolean
  cstPis?: string
  alqPis?: Prisma.Decimal
  cstCofins?: string
  alqCofins?: Prisma.Decimal
  cod?: string

  private constructor({
    nota,
    produto,
    descricao,
    cfop,
    ncm,
    quantidade,
    unitario,
    total,
    st,
    stNfe,
    cf,
    baseICMS,
    valorICMS,
    aliquotaICMS,
    baseTributo,
    refProduto,
    cest,
    unidade,
    companyId,
    pisCofins,
    cstPis,
    alqPis,
    cstCofins,
    alqCofins,
    cod,
  }: NfeProducts) {
    return Object.assign(this, {
      nota,
      produto,
      descricao,
      cfop,
      ncm,
      quantidade,
      unitario,
      total,
      st,
      stNfe,
      cf,
      baseICMS,
      valorICMS,
      aliquotaICMS,
      baseTributo,
      refProduto,
      cest,
      unidade,
      companyId,
      pisCofins,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cod,
    })
  }

  static create(
    {
      nota,
      produto,
      descricao,
      cfop,
      ncm,
      quantidade,
      unitario,
      total,
      st,
      stNfe,
      cf,
      baseICMS,
      valorICMS,
      aliquotaICMS,
      baseTributo,
      refProduto,
      cest,
      unidade,
      companyId,
      pisCofins,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cod,
    }: NfeProducts,
    id?: string,
  ) {
    const nfeProducts = new NfeProducts({
      nota,
      produto,
      descricao,
      cfop,
      ncm,
      quantidade,
      unitario,
      total,
      st,
      stNfe,
      cf,
      baseICMS,
      valorICMS,
      aliquotaICMS,
      baseTributo,
      refProduto,
      cest,
      unidade,
      companyId,
      pisCofins,
      cstPis,
      alqPis,
      cstCofins,
      alqCofins,
      cod,
    })

    nfeProducts.id = id || uuidv4()
    return nfeProducts
  }
}

export { NfeProducts }
