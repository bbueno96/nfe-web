import { Request, Response } from 'express'

import { CartaCorrecaoNfeUseCase } from './CartaCorrecaoNfeUseCase'

export class CartaCorrecaoNfeController {
  constructor(private CartaCorrecaoNfeUseCase: CartaCorrecaoNfeUseCase) {
    this.handle = this.handle.bind(this)
  }

  async handle(request: Request, response: Response) {
    const { companyId } = request.user
    const { nota, cartaCorrecao } = request.body
    const cartaC = await this.CartaCorrecaoNfeUseCase.execute({
      nota,
      companyId,
      carta: cartaCorrecao,
    })
    return response.status(201).json({ cartaC })
  }
}
