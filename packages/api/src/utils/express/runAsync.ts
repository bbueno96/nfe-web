import { RequestHandler, Request, Response, NextFunction } from 'express'

export const runAsync = (fn: RequestHandler) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    await fn(request, response, next)
  } catch (error) {
    next(error)
  }
}
