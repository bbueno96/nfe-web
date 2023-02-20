import { Request, Response } from 'express'

import { ApiError } from '../ApiError'
import { exceptionHandler } from './exceptionHandler'

const request = {} as Request
const response = {} as Response
const next = jest.fn()
const error = new ApiError('', undefined)

response.status = jest.fn().mockImplementation(() => ({ json: jest.fn() }))

describe('Exception handler', () => {
  it('should log error without status code', () => {
    exceptionHandler(error, request, response, next)

    expect(response.status).toBeCalledWith(500)
  })

  it('should not return a status when header sent', () => {
    response.headersSent = true

    exceptionHandler(error, request, response, next)

    expect(response.status).not.toBeCalled()
    expect(next).toBeCalled()
  })
})
