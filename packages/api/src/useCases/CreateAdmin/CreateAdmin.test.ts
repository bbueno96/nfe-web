/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest'

import { app } from '../../app'
import { getAuthToken } from '../../tests/utils'

describe('Create admin', () => {
  it('should create admin', async () => {
    const token = getAuthToken({ roles: ['Admin'] })
    const response = await request(app).post('/admin.add').set('Authorization', `Bearer ${token}`).send({
      name: 'teste',
      login: 'teste1',
      password: '1234',
    })

    expect(response.status).toBe(201)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await request(app).post('/admin.add').set('Authorization', `Bearer ${noRoleToken}`).send({})

    expect(response.status).toBe(403)
  })
})
