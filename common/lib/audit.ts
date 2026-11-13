import {
  AuditService,
  AuditServiceFactory,
} from '@ministryofjustice/hmpps-audit-client'

import { AUDIT } from '../../config'

const logger = require('../../config/logger')

export const createAuditService = (): AuditService =>
  AuditServiceFactory.createInstance(
    {
      enabled: AUDIT.ENABLED,
      queueUrl: AUDIT.SQS_QUEUE_URL,
      region: AUDIT.SQS_REGION,
      serviceName: AUDIT.SERVICE_NAME,
    },
    // winston's logger has the debug/info/warn/error methods the client uses
    logger as Console
  )
