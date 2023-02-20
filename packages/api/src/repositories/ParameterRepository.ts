import { prisma } from '../database/client'
import { Parameter } from '../entities/Parameter'

export class ParameterRepository {
  async getParameter(companyId: string): Promise<Parameter> {
    return await prisma.parameter.findFirst({
      where: { companyId },
    })
  }

  async update(data: Parameter): Promise<Parameter> {
    return await prisma.parameter.update({
      where: { id: data.id },
      data,
    })
  }

  async lastNumeroNota(companyId: string, serie: number): Promise<any> {
    return await prisma.nfe.findFirst({
      where: { companyId, serie },
      orderBy: {
        numeroNota: 'desc',
      },
      select: {
        numeroNota: true,
      },
    })
  }

  async lastBudget(companyId: string): Promise<any> {
    return await prisma.budget.findFirst({
      where: { companyId },
      orderBy: {
        numberBudget: 'desc',
      },
      select: {
        numberBudget: true,
      },
    })
  }

  async lastOrder(companyId: string): Promise<any> {
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
