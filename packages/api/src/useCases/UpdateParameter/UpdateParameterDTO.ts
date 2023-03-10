export interface IUpdateParameterDTO {
  pfx?: Buffer
  passwordCert?: string
  nfeHomologation?: boolean
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
  companyId?: string
  getApoio: boolean
  classificationId: string
  fine?: number
  interest?: number
}
