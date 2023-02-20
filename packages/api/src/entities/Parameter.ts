import { v4 as uuidv4 } from 'uuid'

class Parameter {
  [x: string]: any
  id?: string
  nfeHomologation?: boolean
  pfx: Buffer
  passwordCert?: string
  nfeRazao: string
  nfeFantasia: string
  nfeCnpj: string
  nfeIe: string
  nfeLagradouro: string
  nfeNumero: string
  nfeBairro: string
  nfeUf: string
  nfeUfCod: number
  nfeCidade: string
  nfeCidadeCod: number
  nfeCep: string
  nfeFone: string
  nfeCsc: string
  nfeIndPresenca: number
  nfeIm: string
  nfeCnae: string
  nfeCrt: number
  emailHost: string
  emailPort: number
  emailUsername: string
  emailPassword: string
  emailCopyEmail: string
  serie: number
  ultNota?: number
  ultBudget?: number
  getApoio?: boolean
  companyId?: string
  email?: string
  classificationId: string

  private constructor({
    nfeHomologation,
    pfx,
    passwordCert,
    nfeRazao,
    nfeFantasia,
    nfeCnpj,
    nfeIe,
    nfeLagradouro,
    nfeNumero,
    nfeBairro,
    nfeUf,
    nfeUfCod,
    nfeCidade,
    nfeCidadeCod,
    nfeCep,
    nfeFone,
    nfeCsc,
    nfeIndPresenca,
    nfeIm,
    nfeCnae,
    nfeCrt,
    emailHost,
    emailPort,
    emailUsername,
    emailPassword,
    emailCopyEmail,
    serie,
    companyId,
    email,
    classificationId,
  }: Parameter) {
    return Object.assign(this, {
      nfeHomologation,
      pfx,
      passwordCert,
      nfeRazao,
      nfeFantasia,
      nfeCnpj,
      nfeIe,
      nfeLagradouro,
      nfeNumero,
      nfeBairro,
      nfeUf,
      nfeUfCod,
      nfeCidade,
      nfeCidadeCod,
      nfeCep,
      nfeFone,
      nfeCsc,
      nfeIndPresenca,
      nfeIm,
      nfeCnae,
      nfeCrt,
      emailHost,
      emailPort,
      emailUsername,
      emailPassword,
      emailCopyEmail,
      serie,
      companyId,
      email,
      classificationId,
    })
  }

  static create(
    {
      nfeHomologation,
      pfx,
      passwordCert,
      nfeRazao,
      nfeFantasia,
      nfeCnpj,
      nfeIe,
      nfeLagradouro,
      nfeNumero,
      nfeBairro,
      nfeUf,
      nfeUfCod,
      nfeCidade,
      nfeCidadeCod,
      nfeCep,
      nfeFone,
      nfeCsc,
      nfeIndPresenca,
      nfeIm,
      nfeCnae,
      nfeCrt,
      emailHost,
      emailPort,
      emailUsername,
      emailPassword,
      emailCopyEmail,
      serie,
      companyId,
      email,
      classificationId,
    }: Parameter,
    id?: string,
  ) {
    const parameter = new Parameter({
      nfeHomologation,
      pfx,
      passwordCert,
      nfeRazao,
      nfeFantasia,
      nfeCnpj,
      nfeIe,
      nfeLagradouro,
      nfeNumero,
      nfeBairro,
      nfeUf,
      nfeUfCod,
      nfeCidade,
      nfeCidadeCod,
      nfeCep,
      nfeFone,
      nfeCsc,
      nfeIndPresenca,
      nfeIm,
      nfeCnae,
      nfeCrt,
      emailHost,
      emailPort,
      emailUsername,
      emailPassword,
      emailCopyEmail,
      serie,
      companyId,
      email,
      classificationId,
    })
    parameter.id = id || uuidv4()
    return parameter
  }
}

export { Parameter }
