import { BankRemittance, Prisma } from '@prisma/client'

import { PrismaTransaction } from '../../prisma/types'
import { prisma } from '../database/client'
import { Installment } from '../entities/Installment'
import { IListInstallmentFilters } from '../useCases/ListInstallments/ListInstallmentsDTO'

class DadosInstallment {
  id: string
  numeroDoc?: string | null
  numberInstallment: number
  paid: boolean
  value?: Prisma.Decimal | null
  dueDate: Date
  customerId?: string | null
  customerName?: string | null
  nfeId?: string | null
  nfe?: number | null
  fine?: Prisma.Decimal | null
  interest?: Prisma.Decimal | null
  paymentMethodId?: string | null
  paymentMethodName?: string | null
  companyId?: string | null
  createdAt: Date
  ourNumber?: string | null
  bankRemittanceId?: string | null
}

class DadosBankRem {
  id: string
  createdAt: Date
  bankAccountDescription?: string | null
  numberLot?: number | null
  conteudo?: string | null
  companyId?: string | null
  bankAccountId?: string | null
  wallet?: number | null
}

export class InstallmentRepository {
  update(id: string, data: Partial<Installment>, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.installment.update({
      where: { id },
      data,
    })
  }

  create(data: Installment, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.installment.create({ data })
  }

  findById(id: string) {
    return prisma.installment.findUnique({
      where: { id },
    })
  }

  findByNfe(nfeId: string) {
    return prisma.installment.findMany({
      where: { nfeId },
    })
  }

  saveLot(data: BankRemittance, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.bankRemittance.create({ data })
  }

  async remove(installment: Installment, prismaTransaction: PrismaTransaction | null): Promise<void> {
    const connection = prismaTransaction ?? prisma
    await connection.installment.update({
      where: { id: installment.id },
      data: { disabledAt: new Date() },
    })
  }

  async removeByNfe(nfeId: string, prismaTransaction: PrismaTransaction | null): Promise<void> {
    const connection = prismaTransaction ?? prisma
    await connection.$queryRaw`UPDATE installment SET "disabledAt"=${new Date()} WHERE "nfeId" = ${nfeId}`
    await connection.$queryRaw`DELETE FROM bank_slip_storege WHERE "nfeId" = ${nfeId}`
  }

  createBankSpliStorage(data, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.bankSlipStorege.create({ data })
  }

  getBankSpliByNfe(nfeId: string, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.bankSlipStorege.findMany({ where: { nfeId } })
  }

  getBankSpliByInstallment(installmentId: string, prismaTransaction: PrismaTransaction | null) {
    const connection = prismaTransaction ?? prisma
    return connection.bankSlipStorege.findMany({ where: { installmentId } })
  }

  async list(filters: IListInstallmentFilters): Promise<List<DadosInstallment>> {
    const {
      companyId,
      page,
      perPage,
      maxDueDate,
      minDueDate,
      paymentMethodId,
      customer,
      minCreatedAtDate,
      maxCreatedAtDate,
      isPaid,
      numeroDoc,
      bankRemittanceId,
      ourNumer,
      bankAccountId,
      customerApoioName,
      wallet,
      bankRemittance,
    } = filters

    let where = {}
    if (bankRemittance) {
      where = {
        ...where,
        BankRemittanceId: { equals: null },
      }
    }

    where = {
      ...where,
      companyId: { equals: companyId },
    }
    if (minDueDate && maxDueDate) {
      where = {
        ...where,
        dueDate: {
          gte: minDueDate,
          lte: maxDueDate,
        },
      }
    }
    if (minCreatedAtDate && maxCreatedAtDate) {
      where = {
        ...where,
        createdAt: {
          gte: minCreatedAtDate,
          lte: maxCreatedAtDate,
        },
      }
    }
    if (paymentMethodId) {
      where = {
        ...where,
        paymentMeanId: { contains: paymentMethodId, mode: 'insensitive' },
      }
    }
    if (customer) {
      where = {
        ...where,
        customerId: { contains: customer, mode: 'insensitive' },
      }
    }
    if (isPaid !== null) {
      where = {
        ...where,
        paid: { equals: isPaid },
      }
    }
    if (numeroDoc) {
      where = {
        ...where,
        numeroDoc,
      }
    }
    if (bankRemittanceId) {
      where = {
        ...where,
        bankRemittanceId: { contains: bankRemittanceId, mode: 'insensitive' },
      }
    } else if (bankRemittanceId === null) {
      where = {
        ...where,
        bankRemittanceId: { equals: bankRemittanceId },
      }
    }
    if (ourNumer) {
      where = {
        ...where,
        ourNumer: { contains: ourNumer, mode: 'insensitive' },
      }
    } else if (ourNumer === null) {
      where = {
        ...where,
        ourNumer: { NOT: ourNumer },
      }
    }
    if (bankAccountId) {
      where = {
        ...where,
        bankAccountId,
      }
    }
    if (customerApoioName) {
      where = {
        ...where,
        customerApoioName: { contains: customerApoioName, mode: 'insensitive' },
      }
    }
    if (wallet) {
      where = {
        ...where,
        wallet,
      }
    }

    const items = await prisma.installment.findMany({
      where,
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Customer: true,
        PayMethod: {
          include: {
            BankAccount: true,
          },
        },
        Nfe: true,
      },
    })

    const records = await prisma.installment.count({
      where,
    })
    return {
      items: items.map(e => {
        return {
          id: e.id,
          numeroDoc: e.numeroDoc,
          numberInstallment: e.numberInstallment,
          paid: e.paid,
          value: new Prisma.Decimal(e.value || 0),
          dueDate: e.dueDate,
          customerId: e.customerId,
          customerName: e.Customer ? e.Customer.name : e.customerApoioName,
          nfeId: e.nfeId,
          nfe: e.Nfe?.numeroNota,
          fine: new Prisma.Decimal(e.fine || 0),
          interest: new Prisma.Decimal(e.interest || 0),
          paymentMethodId: e.paymentMethodId,
          paymentMethodName: e.PayMethod?.description,
          companyId: e.companyId,
          createdAt: e.createdAt,
          ourNumber: e.ourNumber,
          bankRemittanceId: e.BankRemittanceId,
        }
      }),
      pager: {
        records,
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }

  async listLot(filters): Promise<List<DadosBankRem>> {
    const { companyId, page, perPage, orderBy, numberLot, bankAccountId, minCreatedAtDate, maxCreatedAtDate } = filters
    let where = {}
    where = {
      ...where,
      companyId: { equals: companyId },
    }

    if (numberLot) {
      where = {
        ...where,
        numberLot: { contains: numberLot, mode: 'insensitive' },
      }
    }

    if (bankAccountId) {
      where = {
        ...where,
        bankAccountId: { equals: bankAccountId },
      }
    }

    if (minCreatedAtDate && maxCreatedAtDate) {
      where = {
        ...where,
        createdAt: {
          gte: minCreatedAtDate,
          lte: maxCreatedAtDate,
        },
      }
    }

    const items = await prisma.bankRemittance.findMany({
      where,
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        createdAt: orderBy as Prisma.SortOrder,
      },
      include: { BankAccount: true },
    })

    const records = await prisma.bankRemittance.count({
      where,
    })

    return {
      items: items.map(e => {
        return {
          id: e.id,
          createdAt: e.createdAt,
          bankAccountDescription: e.BankAccount?.description,
          numberLot: e.numberLot,
          conteudo: e.conteudo,
          companyId: e.companyId,
          bankAccountId: e.bankAccountId,
          wallet: e.wallet,
        }
      }),
      pager: {
        records,
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
