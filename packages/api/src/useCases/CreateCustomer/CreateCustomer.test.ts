/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest'

import { app } from '../../app'
import { prisma } from '../../database/client'
import { getAuthToken } from '../../tests/utils'

describe('Create Customer', () => {
  it('should create customer', async () => {
    const token = getAuthToken({ roles: ['Admin'] })

    const response = await request(app).post('/customer.add').set('Authorization', `Bearer ${token}`).send({
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
      postalCode: '19010000',
      state: 'SP',
      cityId: 1234,
    })

    expect(response.status).toBe(201)
  })

  it('should not create a duplicated customer', async () => {
    const data = {
      cpfCnpj: '65785676745',
      name: 'Empresa',
      email: 'empresa@empresa.com',
      phone: '24998156325',
      mobilePhone: '18952638596',
      dateCreated: new Date(),
      address: 'Rua teste',
      addressNumber: 'S/N',
      complement: 'centro',
      province: 'centro',
      postalCode: '19010000',
      additionalEmails: '',
      state: 'SP',
      cityId: 1234,
      companyId: '50a6fe34-dbb3-496e-b5f3-ae9ab4ee86a7',
    }

    await prisma.customer.create({ data })

    const token = getAuthToken({ roles: ['Admin'] })
    const response = await request(app).post('/customer.add').set('Authorization', `Bearer ${token}`).send(data)

    expect(response.status).toBe(409)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await request(app).post('/customer.add').set('Authorization', `Bearer ${noRoleToken}`).send({})

    expect(response.status).toBe(403)
  })
})
