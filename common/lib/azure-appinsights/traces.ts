import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter'

import { appInsightsResource } from './resource'

export const initialiseTraces = (connectionString: string): NodeTracerProvider => {
  const provider = new NodeTracerProvider({
    resource: appInsightsResource,
    spanProcessors: [new BatchSpanProcessor(new AzureMonitorTraceExporter({ connectionString }))],
  })
  provider.register()
  return provider
}
