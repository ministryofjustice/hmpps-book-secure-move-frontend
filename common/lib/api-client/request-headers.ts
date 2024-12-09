import uuid from 'uuid'

import { API, APP_VERSION } from '../../../config'
import { BasmRequest } from '../../types/basm_request'

export default function getRequestHeaders(
  req: BasmRequest,
  format = 'application/vnd.api+json'
) {
  const headers: { [header: string]: any } = {
    'User-Agent': `hmpps-book-secure-move-frontend/${APP_VERSION}`,
    Accept: `${format}; version=${API.VERSION}`,
    'Accept-Encoding': 'gzip',
    'Idempotency-Key': uuid.v4(),
  }

  if (req && req.user && req.user.username) {
    headers['X-Current-User'] = req.user.username
  }

  if (req && req.transactionId) {
    headers['X-Transaction-ID'] = req.transactionId
  }

  return headers
}
