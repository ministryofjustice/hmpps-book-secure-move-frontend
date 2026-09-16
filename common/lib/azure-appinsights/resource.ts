import fs from 'fs'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

// Maps to Application Insights' ai.cloud.role / ai.application.ver tags -
// see @azure/monitor-opentelemetry-exporter's createTagsFromResource().
export const appInsightsResource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: packageData.name,
  [ATTR_SERVICE_VERSION]: packageData.version,
})
