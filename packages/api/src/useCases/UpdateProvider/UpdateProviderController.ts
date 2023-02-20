import { Request, Response } from 'express'

import { UpdateProviderUseCase } from './UpdateProviderUseCase'

export class UpdateProviderController {
  constructor(private UpdateProviderUseCase: UpdateProviderUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const {
      id,
      cpfCnpj,
      name,
      email,
      phone,
      mobilePhone,
      dateUpdated,
      address,
      addressNumber,
      complement,
      province,
      postalCode,
      cityId,
      state,
      company,
    } = request.body

    const provider = await this.UpdateProviderUseCase.execute({
      id,
      cpfCnpj,
      name,
      email,
      phone,
      mobilePhone,
      dateUpdated,
      address,
      addressNumber,
      complement,
      province,
      postalCode,
      cityId,
      state,
      companyId,
      company,
    })
    return response.status(201).json({ id: provider })
  }
}
