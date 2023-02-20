import { Prisma } from '@prisma/client'

import { prisma } from '../database/client'
import { Customer } from '../entities/Customer'
import { IListCustormersFilters } from '../useCases/ListCustomers/ListCustomersDTO'

export class CustomerRepository {
  async hasCnpj(cpfCnpj: string): Promise<boolean> {
    const count = await prisma.customer.count({ where: { cpfCnpj } })
    return count > 0
  }

  async update(data: Customer): Promise<Customer> {
    return await prisma.customer.update({
      where: { id: data.id },
      data,
    })
  }

  async create(data: Customer): Promise<Customer> {
    return await prisma.customer.create({ data })
  }

  async findById(id: string): Promise<Customer> {
    return await prisma.customer.findUnique({
      where: { id },
    })
  }

  async findByName(name: string): Promise<Customer> {
    return await prisma.customer.findFirst({
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
      skip: Number((page - 1) * perPage) || undefined,
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
        page,
        perPage,
        pages: perPage ? Math.ceil(records / perPage) : 1,
      },
    }
  }
}
