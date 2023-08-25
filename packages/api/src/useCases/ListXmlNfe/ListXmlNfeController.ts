import { Request, Response } from 'express'

import { ListXmlNfeUseCase } from './ListXmlNfeUseCase'

export class ListXmlNfeController {
  constructor(private listXmlNfeUseCase: ListXmlNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const {
      cpfCnpj,
      minDate,
      maxDate,
      name,
      customerApoioProperty,
      page = 1,
      perPage = 10,
      orderBy,
      tipo,
    } = request.body
    const { companyId } = request.user
    const xmls = await this.listXmlNfeUseCase.execute({
      cpfCnpj: cpfCnpj as string,
      companyId,
      tipo,
      minDate,
      maxDate,
      customerApoioProperty,
      name: name as string,
      page: Number(page) || undefined,
      perPage: Number(perPage) || undefined,
      orderBy: orderBy as string,
      status: 'Autorizado',
    })

    if (xmls) {
      response.setHeader('Content-type', 'application/zip')
      response.setHeader('Content-disposition', 'attachment; filename=nfes.zip')
      return response.send(xmls)
    } else {
      return response.json({ menssage: 'Nfe ainda não salva' })
    }
  }
}
