/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest'

import { app } from '../../app'
import { getAuthToken } from '../../tests/utils'

describe('Create Classification', () => {
  it('should create Classification', async () => {
    const token = getAuthToken({ roles: ['Admin'] })

    const response = await request(app).post('/classification.add').set('Authorization', `Bearer ${token}`).send({
      description: 'Grupo 1',
      code: '1',
      isGroup: false,
      parentId: 1,
    })
    expect(response.status).toBe(201)
  })
  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await request(app)
      .post('/classification.add')
      .set('Authorization', `Bearer ${noRoleToken}`)
      .send({})

    expect(response.status).toBe(403)
  })
})
