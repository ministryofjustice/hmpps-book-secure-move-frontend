import * as appInsights from 'applicationinsights'
import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { Contracts } from 'applicationinsights'
import fs from 'fs'

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export type ContextObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any
} | undefined

export const initialiseAppInsights = () => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')
    appInsights.setup().setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C).start()
    appInsights.defaultClient.context.tags['ai.cloud.role'] = packageData.name
    appInsights.defaultClient.context.tags['ai.application.ver'] = packageData.version
    appInsights.defaultClient.addTelemetryProcessor(addUserDataToRequests)
    return appInsights.defaultClient
  }
  return null
}

export const addUserDataToRequests = (envelope: EnvelopeTelemetry, contextObjects: ContextObject): boolean => {
  const isRequest = envelope.data.baseType === Contracts.TelemetryTypeString.Request
  if (isRequest) {
    const session = contextObjects?.['http.ServerRequest']?.res?.req?.session
    const username = session?.user?.username
    const activeCaseLoadId = session?.currentLocation?.nomis_agency_id
    if (username) {
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData!.properties = {
        username,
        activeCaseLoadId,
        ...envelope.data.baseData!.properties,
      }
    }
  }
  return true
}
