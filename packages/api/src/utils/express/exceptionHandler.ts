import { NextFunction, Request, Response } from 'express'

import { ApiError } from '../ApiError'

export function exceptionHandler(err: ApiError, request: Request, response: Response, next: NextFunction) {
  if (response.headersSent) {
    return next(err)
  }

  return response.status(err.statusCode || 500).json({ message: err.message })
}
