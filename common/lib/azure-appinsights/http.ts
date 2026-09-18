import http, { ClientRequest, IncomingMessage, ServerResponse } from 'http'

const IGNORED_REQUEST_PREFIXES = ['GET /healthcheck/ping', 'GET /metrics']

type SessionRequest = IncomingMessage & {
  session?: {
    user?: { username?: string }
    currentLocation?: { nomis_agency_id?: string }
  }
}

type MinimalSpan = { setAttribute: (key: string, value: string) => void }

export const shouldIgnoreIncomingRequest = (request: IncomingMessage): boolean => {
  const path = request.url?.split('?')[0] ?? ''
  const requestName = `${request.method} ${path}`
  return IGNORED_REQUEST_PREFIXES.some(prefix => requestName.startsWith(prefix))
}

export const addUserDataToSpan = (span: MinimalSpan, request: SessionRequest): void => {
  const username = request.session?.user?.username
  const activeCaseLoadId = request.session?.currentLocation?.nomis_agency_id
  if (username) {
    span.setAttribute('username', username)
  }
  if (activeCaseLoadId) {
    span.setAttribute('activeCaseLoadId', activeCaseLoadId)
  }
}

// Declared via an untyped const (rather than inline) so it isn't excess-property-checked against
// @opentelemetry/instrumentation-http's config type when passed into HttpInstrumentation below.
export const httpInstrumentationOptions = {
  enabled: true,
  ignoreIncomingRequestHook: shouldIgnoreIncomingRequest,
  applyCustomAttributesOnSpan: (
    span: MinimalSpan,
    request: IncomingMessage | ClientRequest,
    response: IncomingMessage | ServerResponse,
  ) => {
    // request/response are also passed for outgoing (dependency) spans, where response is an
    // IncomingMessage rather than a ServerResponse - only enrich incoming server requests.
    if (response instanceof http.ServerResponse) {
      addUserDataToSpan(span, request as SessionRequest)
    }
  },
}
