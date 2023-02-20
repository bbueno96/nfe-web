import { Prisma } from '@prisma/client'

import { ProductRepository } from '../repositories/ProductRepository'

export interface ProdutoInfo {
  id?: string
  barCode: string
  weight: Prisma.Decimal
}

export async function getProdutoInfo(id: string): Promise<ProdutoInfo> {
  const productRepository = new ProductRepository()
  const produtoInfo = await productRepository.findById(id)

  return produtoInfo
}
