import { Request, Response } from 'express'

import { CreateProviderUseCase } from './CreateProviderUseCase'

export class CreateProviderController {
  constructor(private CreateProviderUseCase: CreateProviderUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      cpfCnpj,
      name,
      email,
      phone,
      mobilePhone,
      dateCreated,
      address,
      addressNumber,
      complement,
      province,
      postalCode,
      cityId,
      state,
    } = request.body

    const id = await this.CreateProviderUseCase.execute({
      cpfCnpj,
      name,
      email,
      phone,
      mobilePhone,
      dateCreated,
      address,
      addressNumber,
      complement,
      province,
      postalCode,
      cityId,
      state,
      companyId,
      informarGTIN: false,
    })
    return response.status(201).json({ id })
  }
}
