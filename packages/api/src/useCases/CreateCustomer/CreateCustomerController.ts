import { Request, Response } from 'express'

import { CreateCustomerUseCase } from './CreateCustomerUseCase'

export class CreateCustomerController {
  constructor(private CreateCustomerUseCase: CreateCustomerUseCase) {
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

    const id = await this.CreateCustomerUseCase.execute({
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
    })
    return response.status(201).json({ id })
  }
}
