import { Request, Response } from 'express'

import { UpdateCustomerUseCase } from './UpdateCustomerUseCase'

export class UpdateCustomerController {
  constructor(private UpdateCustomerUseCase: UpdateCustomerUseCase) {
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
    } = request.body

    const customer = await this.UpdateCustomerUseCase.execute({
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
    })
    return response.status(201).json({ id: customer })
  }
}
