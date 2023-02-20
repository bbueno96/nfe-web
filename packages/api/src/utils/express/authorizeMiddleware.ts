import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import * as Sentry from '@sentry/node'

export function authorizeAnonymous() {
  return [
    (request: Request, response: Response, next: NextFunction) => {
      const authHeader = request.headers.authorization

      if (!authHeader) {
        return next()
      }

      const [, token] = authHeader.split(' ')

      try {
        const decoded = <TokenOperator>jwt.verify(token, process.env.APP_SECRET)

        request.user = decoded
        Sentry.setExtra('operator', decoded)

        return next()
      } catch (err) {
        return response.status(401).json({ message: 'Token inválida!' })
      }
    },
  ]
}

export function authorize(...roles: string[]) {
  return [
    (request: Request, response: Response, next: NextFunction) => {
      const authHeader = request.headers.authorization

      if (!authHeader) {
        return response.status(401).json({ message: 'Token não informada!' })
      }

      const [, token] = authHeader.split(' ')

      try {
        const decoded = <TokenOperator>jwt.verify(token, process.env.APP_SECRET)

        request.user = decoded
        Sentry.setExtra('operator', decoded)

        return next()
      } catch (err) {
        return response.status(401).json({ message: 'Token inválida!' })
      }
    },

    (request: Request, response: Response, next: NextFunction) => {
      if (roles.length && !roles.some(role => request.user.roles.includes(role))) {
        return response.status(403).json({ message: 'Você não tem permissão pra executar essa ação!' })
      }

      return next()
    },
  ]
}
