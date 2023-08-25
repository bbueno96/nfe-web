import { Prisma } from '@prisma/client'

import { ProductRepository } from '../repositories/ProductRepository'

export interface ProdutoInfo {
  id?: string
  barCode?: string | null
  weight?: Prisma.Decimal | null
}

export async function getProdutoInfo(id: string) {
  const productRepository = new ProductRepository()
  const produtoInfo = await productRepository.findById(id)

  return produtoInfo
}
