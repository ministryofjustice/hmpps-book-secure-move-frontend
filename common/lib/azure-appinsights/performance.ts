import { performance, monitorEventLoopDelay } from 'perf_hooks'
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { AzureMonitorMetricExporter } from '@azure/monitor-opentelemetry-exporter'

import { appInsightsResource } from './resource'

// FIDELITY NOTE: this is a best-effort stand-in for Application Insights' built-in
// "Performance" blade counters, not a reproduction of them. That blade recognises specific
// metric names (Private_Bytes, Processor_Time, Request_Rate, Exception_Rate, ...) plus a
// `_MS.IsAutocollected` marker emitted by Microsoft's internal (unexported)
// PerformanceCounterMetrics class, which also covers request/exception rates that we don't
// have here. Reproducing that exact name/marker combination while only implementing a subset
// would render a partially-populated, misleading Performance blade - so these are shipped as
// distinctly-named custom metrics, visible under Metrics Explorer instead.
const EXPORT_INTERVAL_MS = 60_000

const eventLoopHistogram = monitorEventLoopDelay({ resolution: 20 })
eventLoopHistogram.enable()

let lastCpuUsage = process.cpuUsage()
let lastSampleTime = performance.now()

export const getCpuPercent = (): number => {
  const usage = process.cpuUsage(lastCpuUsage)
  const elapsedMs = performance.now() - lastSampleTime
  lastCpuUsage = process.cpuUsage()
  lastSampleTime = performance.now()
  const totalUsageMs = (usage.user + usage.system) / 1000
  return elapsedMs > 0 ? (totalUsageMs / elapsedMs) * 100 : 0
}

export const initialisePerformanceMetrics = (connectionString: string): MeterProvider => {
  const provider = new MeterProvider({
    resource: appInsightsResource,
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new AzureMonitorMetricExporter({ connectionString }),
        exportIntervalMillis: EXPORT_INTERVAL_MS,
      }),
    ],
  })
  const meter = provider.getMeter('custom.process-metrics')

  meter.createObservableGauge('custom.process.cpu_percent').addCallback(observable => {
    observable.observe(getCpuPercent())
  })
  meter.createObservableGauge('custom.process.memory.rss_bytes').addCallback(observable => {
    observable.observe(process.memoryUsage().rss)
  })
  meter.createObservableGauge('custom.process.memory.heap_used_bytes').addCallback(observable => {
    observable.observe(process.memoryUsage().heapUsed)
  })
  meter.createObservableGauge('custom.process.eventloop.lag_mean_ms').addCallback(observable => {
    // .mean is NaN until the histogram has recorded at least one sample (e.g. an export
    // forced very soon after startup, before any event loop ticks have been measured).
    if (!Number.isNaN(eventLoopHistogram.mean)) {
      observable.observe(eventLoopHistogram.mean / 1e6)
    }
  })

  return provider
}
