import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { NfeProducts } from '../entities/NfeProducts'

export class NfeProductsRepository {
  async update(id: string, data: Partial<NfeProducts>, prismaTransaction: PrismaTransaction) {
    return await prismaTransaction.nfeProduto.update({
      where: { id },
      data,
    })
  }

  create(data: NfeProducts, prismaTransaction: PrismaTransaction) {
    return prismaTransaction.nfeProduto.create({ data })
  }

  findById(id: string) {
    return prisma.nfeProduto.findUnique({
      where: { id },
    })
  }

  findByNfe(nota: string) {
    return prisma.nfeProduto.findMany({
      where: { nota },
      select: { id: true, quantidade: true, Product: { select: { id: true, stock: true } } },
    })
  }

  findByNfeAll(nota: string) {
    return prisma.nfeProduto.findMany({
      where: { nota },
    })
  }

  async remove(nota: string, prismaTransaction: PrismaTransaction): Promise<void> {
    await prismaTransaction.$queryRaw`DELETE FROM nfe_produto WHERE "nota" = ${nota}`
  }
}
