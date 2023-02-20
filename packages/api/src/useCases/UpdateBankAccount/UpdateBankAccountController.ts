import { Request, Response } from 'express'

import { UpdateBankAccountUseCase } from './UpdateBankAccountUseCase'

export class UpdateBankAccountController {
  constructor(private updateBankAccountUseCase: UpdateBankAccountUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { id, description, institution, number, verifyingDigit, agency, ourNumber, wallet } = request.body

    await this.updateBankAccountUseCase.execute({
      id,
      description,
      institution,
      number,
      verifyingDigit,
      agency,
      companyId,
      ourNumber,
      wallet,
    })

    return response.status(204).send()
  }
}
