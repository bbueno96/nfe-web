import { Request, Response } from 'express'

import { UpdateParameterUseCase } from './UpdateParameterUseCase'

export class UpdateParameterController {
  constructor(private updateParameterUseCase: UpdateParameterUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
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
      getApoio,
      classificationId,
      fine,
      interest,
    } = request.body
    const buffer = request.file?.buffer
    const { companyId } = request.user
    await this.updateParameterUseCase.execute({
      nfeHomologation: nfeHomologation === 'true',
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
      pfx: buffer,
      companyId,
      getApoio: getApoio === 'true',
      classificationId,
      fine,
      interest,
    })

    return response.status(204).send()
  }
}
