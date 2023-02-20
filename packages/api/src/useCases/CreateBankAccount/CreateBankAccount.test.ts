/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest'

import { app } from '../../app'
import { getAuthToken } from '../../tests/utils'

describe('Create BankAccount', () => {
  it('should create BankAccount', async () => {
    const token = getAuthToken({ roles: ['Admin'] })

    const response = await request(app).post('/bankaccount.add').set('Authorization', `Bearer ${token}`).send({
      description: 'Grupo 1',
      institution: 756,
      number: 0,
      verifyingDigit: 0,
      agency: 0,
    })

    expect(response.status).toBe(201)
  })
  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await request(app).post('/bankaccount.add').set('Authorization', `Bearer ${noRoleToken}`).send({})

    expect(response.status).toBe(403)
  })
})
