import { BankRemittance, Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Installment } from '../entities/Installment'
import { IListInstallmentFilters } from '../useCases/ListInstallments/ListInstallmentsDTO'

export class InstallmentRepository {
  async update(data: Installment): Promise<Installment> {
    return await prisma.installment.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Installment): Promise<Installment> {
    return await prisma.installment.create({ data })
  }

  async findById(id: string): Promise<Installment> {
    return await prisma.installment.findUnique({
      where: { id },
    })
  }

  async findByNfe(nfeId: string): Promise<any> {
    return await prisma.installment.findMany({
      where: { nfeId },
    })
  }

  async saveLot(data: BankRemittance): Promise<BankRemittance> {
    return await prisma.bankRemittance.create({ data })
  }

  async remove(installment: Installment): Promise<void> {
    await prisma.installment.update({
      where: { id: installment.id },
      data: { disabledAt: new Date() },
    })
  }

  async removeByNfe(nfeId: string): Promise<void> {
    await prisma.$queryRaw`UPDATE installment SET "disabledAt"=${new Date()} WHERE "nfeId" = ${nfeId}`
    await prisma.$queryRaw`DELETE FROM bank_slip_storege WHERE "nfeId" = ${nfeId}`
  }

  async createBankSpliStorage(data): Promise<any> {
    return await prisma.bankSlipStorege.create({ data })
  }

  async getBankSpliByNfe(nfeId: string): Promise<any> {
    return await prisma.bankSlipStorege.findMany({ where: { nfeId } })
  }

  async getBankSpliByInstallment(installmentId: string): Promise<any> {
    return await prisma.bankSlipStorege.findMany({ where: { installmentId } })
  }

  async list(filters: IListInstallmentFilters): Promise<List<Installment>> {
    const {
      companyId,
      page,
      perPage,
      orderBy,
      maxDueDate,
      minDueDate,
      paymentMethodId,
      customer,
      minCreatedAtDate,
      maxCreatedAtDate,
      isPaid,
      document,
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
    if (document) {
      where = {
        ...where,
        numeroDoc: { contains: document, mode: 'insensitive' },
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
      skip: Number((page - 1) * perPage) || undefined,
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
          value: e.value,
          dueDate: e.dueDate,
          customerId: e.customerId,
          customerName: e.Customer ? e.Customer.name : e.customerApoioName,
          nfeId: e.nfeId,
          nfe: e.Nfe?.numeroNota,
          fine: e.fine,
          interest: e.interest,
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
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }

  async listLot(filters): Promise<List<BankRemittance>> {
    const { companyId, page, perPage, orderBy, numberLot } = filters
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

    const items = await prisma.bankRemittance.findMany({
      where,
      skip: Number((page - 1) * perPage) || undefined,
      take: perPage,
      orderBy: {
        numberLot: orderBy as Prisma.SortOrder,
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
          bankAccountDescription: e.BankAccount.description,
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
