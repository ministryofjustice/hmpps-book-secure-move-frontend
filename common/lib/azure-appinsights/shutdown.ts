import type { LoggerProvider } from '@opentelemetry/sdk-logs'
import type { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import type { MeterProvider } from '@opentelemetry/sdk-metrics'

export const registerShutdownFlush = (
  tracerProvider: NodeTracerProvider,
  loggerProvider: LoggerProvider,
  meterProvider: MeterProvider,
): void => {
  const flushAndExit = async () => {
    await Promise.allSettled([tracerProvider.shutdown(), loggerProvider.shutdown(), meterProvider.shutdown()])
    process.exit(0)
  }
  process.on('SIGTERM', flushAndExit)
  process.on('SIGINT', flushAndExit)
}
