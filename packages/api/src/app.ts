import 'dotenv/config'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import { types } from 'pg'

import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import { router } from './routes'
import { exceptionHandler } from './utils/express/exceptionHandler'

const app = express()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app, router })],
  tracesSampleRate: Number(process.env.SENTRY_TRACE_RATE),
})

types.setTypeParser(1700, function (val) {
  return parseFloat(val)
})

app.use(express.json())
app.use(compression())
app.use(cors())
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())
app.use(router)
app.use(Sentry.Handlers.errorHandler())
app.use(exceptionHandler)

export { app }
