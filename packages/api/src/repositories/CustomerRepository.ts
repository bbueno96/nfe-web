import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Customer } from '../entities/Customer'
import { IListCustormersFilters } from '../useCases/ListCustomers/ListCustomersDTO'

export class CustomerRepository {
  async hasCnpj(cpfCnpj: string): Promise<boolean> {
    const count = await prisma.customer.count({ where: { cpfCnpj } })
    return count > 0
  }

  update(id: string, data: Partial<Customer>) {
    return prisma.customer.update({
      where: { id },
      data,
    })
  }

  create(data: Customer) {
    return prisma.customer.create({ data })
  }

  findById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
    })
  }

  findByName(name: string) {
    return prisma.customer.findFirst({
      where: { name },
    })
  }

  async remove(customer: Customer): Promise<void> {
    await prisma.customer.update({
      where: { id: customer.id },
      data: customer,
    })
  }

  async list(filters: IListCustormersFilters): Promise<List<Customer>> {
    const { companyId, cpfCnpj, name, page, perPage, orderBy } = filters
    let where = {}
    where = {
      ...where,
      companyId: { equals: companyId },
    }
    if (name) {
      where = {
        ...where,
        name: { contains: name, mode: 'insensitive' },
      }
    }
    if (cpfCnpj) {
      where = {
        ...where,
        cpfCnpj: { contains: cpfCnpj },
      }
    }

    const items = await prisma.customer.findMany({
      where,
      skip: ((page ?? 1) - 1) * (perPage ?? 10),
      take: perPage,
      orderBy: {
        dateCreated: orderBy as Prisma.SortOrder,
      },
    })

    const records = await prisma.customer.count({
      where,
    })

    return {
      items,
      pager: {
        records,
        page: page ?? 1,
        perPage: perPage ?? 10,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
