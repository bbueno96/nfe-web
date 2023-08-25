/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest'

import { app } from '../../app'
import { prisma } from '../../database/client'
import { Customer } from '../../entities/Customer'
import { getAuthToken } from '../../tests/utils'

describe('Update customer', () => {
  /* it('should list some customers', async () => {
    await Promise.all([
      prisma.customer.create({
        cpfCnpj: '39728695000168',
        name: 'Empresa',
        email: 'empresa@empresa.com',
        phone: '24998156325',
        mobilePhone: '18952638596',
        dateCreated: new Date(),
        address: 'Rua teste',
        addressNumber: 'S/N',
        complement: ' ',
        province: 'centro',
        postalCode: '19045000',
        cityId: 123,
        state: 'SP',
        companyId: '50a6fe34-dbb3-496e-b5f3-ae9ab4ee86a7',
        informarGTIN: false,
      }),
      prisma.customer.create({
          cpfCnpj: '16017221507',
          name: 'Empresa',
          email: 'empresa@empresa.com',
          phone: '24998156325',
          mobilePhone: '18952638596',
          dateCreated: new Date(),
          address: 'Rua teste',
          addressNumber: 'S/N',
          complement: ' ',
          province: 'centro',
          postalCode: '19045000',
          cityId: 123,
          state: 'SP',
          companyId: '50a6fe34-dbb3-496e-b5f3-ae9ab4ee86a7',
      }),
    ])

    const token = getAuthToken({ roles: ['Admin'] })
    const response = await request(app).post('/customer.list').set('Authorization', `Bearer ${token}`).send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('items')
    expect(response.body.items).toHaveLength(2)
  }) */

  it('should not access without token', async () => {
    const response = await request(app).post('/customer.list').send()
    expect(response.status).toBe(401)
  })
})
