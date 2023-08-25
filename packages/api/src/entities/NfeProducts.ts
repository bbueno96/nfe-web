import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class NfeProducts {
  id?: string
  nota?: string | null
  produto?: string | null
  descricao: string
  cfop: string
  ncm: string
  quantidade?: Prisma.Decimal | null
  unitario?: Prisma.Decimal | null
  total?: Prisma.Decimal | null
  st: number
  stNfe?: string | null
  cf?: number | null
  baseICMS?: Prisma.Decimal | null
  valorICMS?: Prisma.Decimal | null
  aliquotaICMS?: Prisma.Decimal | null
  baseTributo?: Prisma.Decimal | null
  refProduto?: string | null
  cest?: string | null
  baseIcmsSt?: Prisma.Decimal | null
  valorIcmsSt?: Prisma.Decimal | null
  aliquotaIcmsSt?: Prisma.Decimal | null
  mva?: Prisma.Decimal | null
  unidade: string
  companyId?: string | null
  pisCofins: boolean
  cstPis?: string | null
  alqPis?: Prisma.Decimal | null
  cstCofins?: string | null
  alqCofins?: Prisma.Decimal | null
  cod?: string | null
  producttax?: string | null
  uf?: string | null
  ipi: Prisma.Decimal
  valorBaseIcms?: Prisma.Decimal | null
  valorBaseIcmsSt?: Prisma.Decimal | null

  constructor(props: Omit<NfeProducts, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.nota = props.nota
    this.descricao = props.descricao
    this.cfop = props.cfop
    this.ncm = props.ncm
    this.quantidade = new Prisma.Decimal(props.quantidade || 0)
    this.unitario = new Prisma.Decimal(props.unitario || 0)
    this.total = new Prisma.Decimal(props.total || 0)
    this.st = props.st
    this.stNfe = props.stNfe
    this.cf = props.cf
    this.baseICMS = new Prisma.Decimal(props.baseICMS || 0)
    this.valorICMS = new Prisma.Decimal(props.valorICMS || 0)
    this.aliquotaICMS = new Prisma.Decimal(props.aliquotaICMS || 0)
    this.baseTributo = new Prisma.Decimal(props.baseTributo || 0)
    this.refProduto = props.refProduto
    this.cest = props.cest
    this.unidade = props.unidade
    this.companyId = props.companyId
    this.pisCofins = props.pisCofins
    this.cstPis = props.cstPis
    this.alqPis = new Prisma.Decimal(props.alqPis || 0)
    this.cstCofins = props.cstCofins
    this.alqCofins = new Prisma.Decimal(props.alqCofins || 0)
    this.cod = props.cod
    this.producttax = props.producttax
    this.uf = props.uf
    this.ipi = new Prisma.Decimal(props.ipi || 0)
    this.mva = new Prisma.Decimal(props.mva || 0)
    this.valorBaseIcms = new Prisma.Decimal(props.valorBaseIcms || 0)
    this.valorBaseIcmsSt = new Prisma.Decimal(props.valorBaseIcmsSt || 0)
    this.baseIcmsSt = new Prisma.Decimal(props.baseIcmsSt || 0)
    this.valorIcmsSt = new Prisma.Decimal(props.valorBaseIcmsSt || 0)
    this.aliquotaIcmsSt = new Prisma.Decimal(props.aliquotaIcmsSt || 0)
  }
}

export { NfeProducts }
