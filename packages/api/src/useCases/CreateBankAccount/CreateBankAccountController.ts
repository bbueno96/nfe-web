import { Request, Response } from 'express'

import { CreateBankAccountUseCase } from './CreateBankAccountUseCase'

export class CreateBankAccountController {
  constructor(private CreateBankAccountUseCase: CreateBankAccountUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { description, institution, number, verifyingDigit, agency, ourNumber, wallet } = request.body
    const { companyId } = request.user

    const id = await this.CreateBankAccountUseCase.execute({
      description,
      institution,
      number,
      verifyingDigit,
      agency,
      companyId,
      ourNumber,
      wallet,
    })
    return response.status(201).json({ id })
  }
}
