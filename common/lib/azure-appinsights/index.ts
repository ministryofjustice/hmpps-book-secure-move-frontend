import fs from 'fs'
import { logs } from '@opentelemetry/api-logs'
import type { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'

import { initialiseTraces } from './traces'
import { initialiseLogs } from './logs'
import { initialiseInstrumentations } from './instrumentations'
import { registerExceptionHandlers } from './exceptions'
import { initialisePerformanceMetrics } from './performance'
import { registerShutdownFlush } from './shutdown'

export { shouldIgnoreIncomingRequest, addUserDataToSpan } from './http'

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export const initialiseAppInsights = (): NodeTracerProvider | null => {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  if (!connectionString) {
    return null
  }

  // eslint-disable-next-line no-console
  console.log('Enabling azure application insights')

  const tracerProvider = initialiseTraces(connectionString)
  const loggerProvider = initialiseLogs(connectionString)
  const meterProvider = initialisePerformanceMetrics(connectionString)
  initialiseInstrumentations()
  registerExceptionHandlers(logs.getLogger(packageData.name), loggerProvider, tracerProvider)
  registerShutdownFlush(tracerProvider, loggerProvider, meterProvider)

  return tracerProvider
}
