import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis'
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston'

import { httpInstrumentationOptions } from './http'

// Must run before the target modules (http, redis, winston) are first required anywhere -
// instrument.js calls initialiseAppInsights() as the very first thing, before express/http/
// config/logger/config/redis-store are required, so this holds.
export const initialiseInstrumentations = (): void => {
  registerInstrumentations({
    instrumentations: [new HttpInstrumentation(httpInstrumentationOptions), new RedisInstrumentation(), new WinstonInstrumentation()],
  })
}
