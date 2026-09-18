import type { Logger } from '@opentelemetry/api-logs'
import { SeverityNumber } from '@opentelemetry/api-logs'
import type { LoggerProvider } from '@opentelemetry/sdk-logs'
import type { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { ATTR_EXCEPTION_TYPE, ATTR_EXCEPTION_MESSAGE, ATTR_EXCEPTION_STACKTRACE } from '@opentelemetry/semantic-conventions'

const safeStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

export const errorToLogAttributes = (error: unknown): Record<string, string> => {
  if (error instanceof Error) {
    return {
      [ATTR_EXCEPTION_TYPE]: error.name || 'Error',
      [ATTR_EXCEPTION_MESSAGE]: error.message,
      [ATTR_EXCEPTION_STACKTRACE]: error.stack ?? `${error.name}: ${error.message}`,
    }
  }
  // unhandledRejection reasons aren't guaranteed to be Errors (e.g. Promise.reject('boom')).
  const message = typeof error === 'string' ? error : safeStringify(error)
  return {
    [ATTR_EXCEPTION_TYPE]: 'NonErrorRejection',
    [ATTR_EXCEPTION_MESSAGE]: message,
    [ATTR_EXCEPTION_STACKTRACE]: message,
  }
}

const FLUSH_TIMEOUT_MS = 2000 // matches Sentry's own default shutdown timeout

const emitExceptionLog = (logger: Logger, error: unknown) => {
  logger.emit({
    severityNumber: SeverityNumber.ERROR,
    severityText: 'ERROR',
    body: error instanceof Error ? error.message : String(error),
    attributes: errorToLogAttributes(error),
  })
}

export const flushWithTimeout = (loggerProvider: LoggerProvider, tracerProvider: NodeTracerProvider): Promise<unknown> =>
  Promise.race([
    Promise.all([loggerProvider.forceFlush(), tracerProvider.forceFlush()]),
    new Promise(resolve => {
      setTimeout(resolve, FLUSH_TIMEOUT_MS)
    }),
  ])

export const registerExceptionHandlers = (
  logger: Logger,
  loggerProvider: LoggerProvider,
  tracerProvider: NodeTracerProvider,
): void => {
  process.on('uncaughtException', error => {
    emitExceptionLog(logger, error)
    // Must not call process.exit() synchronously here. Sentry's own uncaughtException handler
    // (registered after ours in instrument.js) only defers exiting to us because we're
    // registered - see @sentry/node-core's onUncaughtException integration. Node invokes
    // uncaughtException listeners synchronously in registration order, so an immediate exit()
    // here would stop Sentry's handler (and its crash reporting) from ever running.
    flushWithTimeout(loggerProvider, tracerProvider).finally(() => process.exit(1))
  })

  process.on('unhandledRejection', reason => {
    emitExceptionLog(logger, reason)
    // Deliberately does not exit - matches the app's existing behaviour (Sentry's own
    // unhandledRejection integration runs in 'warn' mode here and doesn't crash either).
  })
}
