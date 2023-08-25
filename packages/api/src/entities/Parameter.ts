import { v4 as uuidv4 } from 'uuid'

import { Prisma } from '@prisma/client'

class Parameter {
  id?: string
  nfeHomologation: boolean
  pfx?: Buffer | null
  passwordCert?: string | null
  nfeRazao?: string | null
  nfeFantasia?: string | null
  nfeCnpj?: string | null
  nfeIe?: string | null
  nfeLagradouro?: string | null
  nfeNumero?: string | null
  nfeBairro?: string | null
  nfeUf?: string | null
  nfeUfCod?: number | null
  nfeCidade?: string | null
  nfeCidadeCod?: number | null
  nfeCep?: string | null
  nfeFone?: string | null
  nfeCsc?: string | null
  nfeIndPresenca?: number | null
  nfeIm?: string | null
  nfeCnae?: string | null
  nfeCrt?: number | null
  emailHost?: string | null
  emailPort?: number | null
  emailUsername?: string | null
  emailPassword?: string | null
  emailCopyEmail?: string | null
  serie?: number | null
  ultNota?: number | null
  ultBudget?: number | null
  getApoio: boolean
  companyId?: string | null
  email?: string | null
  classificationId?: string | null
  fine?: Prisma.Decimal | null
  interest?: Prisma.Decimal | null

  constructor(props: Omit<Parameter, 'id'>, id?: string) {
    this.id = id || uuidv4()
    this.nfeHomologation = props.nfeHomologation
    this.pfx = props.pfx
    this.passwordCert = props.passwordCert
    this.nfeRazao = props.nfeRazao
    this.nfeFantasia = props.nfeFantasia
    this.nfeCnpj = props.nfeCnpj
    this.nfeIe = props.nfeIe
    this.nfeLagradouro = props.nfeLagradouro
    this.nfeNumero = props.nfeNumero
    this.nfeBairro = props.nfeBairro
    this.nfeUf = props.nfeUf
    this.nfeUfCod = props.nfeUfCod
    this.nfeCidade = props.nfeCidade
    this.nfeCidadeCod = props.nfeCidadeCod
    this.nfeCep = props.nfeCep
    this.nfeFone = props.nfeFone
    this.nfeCsc = props.nfeCsc
    this.nfeIndPresenca = props.nfeIndPresenca
    this.nfeIm = props.nfeIm
    this.nfeCnae = props.nfeCnae
    this.nfeCrt = props.nfeCrt
    this.emailHost = props.emailHost
    this.emailPort = props.emailPort
    this.emailUsername = props.emailUsername
    this.emailPassword = props.emailPassword
    this.emailCopyEmail = props.emailCopyEmail
    this.serie = props.serie
    this.companyId = props.companyId
    this.email = props.email
    this.classificationId = props.classificationId
    this.fine = new Prisma.Decimal(props.fine || 0)
    this.interest = new Prisma.Decimal(props.interest || 0)
  }
}

export { Parameter }
