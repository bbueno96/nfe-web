import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { Parameter } from '../entities/Parameter'

export class ParameterRepository {
  getParameter(companyId: string) {
    return prisma.parameter.findFirst({
      where: { companyId },
    })
  }

  update(id: string, data: Partial<Parameter>, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.parameter.update({
      where: { id },
      data,
    })
  }

  lastNumeroNota(companyId: string, serie: number) {
    return prisma.nfe.findFirst({
      where: { companyId, serie },
      orderBy: {
        numeroNota: 'desc',
      },
      select: {
        numeroNota: true,
      },
    })
  }

  lastBudget(companyId: string) {
    return prisma.budget.findFirst({
      where: { companyId },
      orderBy: {
        numberBudget: 'desc',
      },
      select: {
        numberBudget: true,
      },
    })
  }

  async lastOrder(companyId: string) {
    return await prisma.order.findFirst({
      where: { companyId },
      orderBy: {
        numberOrder: 'desc',
      },
      select: {
        numberOrder: true,
      },
    })
  }
}
