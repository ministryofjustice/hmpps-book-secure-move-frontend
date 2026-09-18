import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'
import { logs } from '@opentelemetry/api-logs'
import { AzureMonitorLogExporter } from '@azure/monitor-opentelemetry-exporter'

import { appInsightsResource } from './resource'

export const initialiseLogs = (connectionString: string): LoggerProvider => {
  const provider = new LoggerProvider({
    resource: appInsightsResource,
    processors: [new BatchLogRecordProcessor({ exporter: new AzureMonitorLogExporter({ connectionString }) })],
  })
  logs.setGlobalLoggerProvider(provider)
  return provider
}
