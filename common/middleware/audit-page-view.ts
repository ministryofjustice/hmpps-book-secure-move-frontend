import type {
  AuditEvent,
  AuditService,
  SubjectType,
} from '@ministryofjustice/hmpps-audit-client'
import type { NextFunction, Request, Response } from 'express'

const logger = require('../../config/logger')

/**
 * Requests that are not page views: person images.
 * Health checks, static assets and auth routes are either mounted earlier
 * in server.js or have no signed-in user, so never reach the audit call.
 */
const notPageViews = [/\/image(\?|$)/, /^\/auth(\/|\?|$)/]

/** HMPPS Audit rejects subject ids longer than this */
const maxSubjectIdLength = 80

type Subject = { subjectType: SubjectType; subjectId?: string }

type AuditedRequest = Request & {
  transactionId?: string
  session?: { user?: { username?: string } }
  move?: { id?: string; profile?: { person?: { id?: string; prison_number?: string } } }
  person?: { id?: string; prison_number?: string }
}

type RenderCallback = (err: Error | null, html?: string) => void
type Render = (view: string, options?: object, callback?: RenderCallback) => void

/**
 * Audits page views to HMPPS Audit.
 *
 * Emits VIEW_PAGE_ACCESS_ATTEMPT once the response closes – covering redirects,
 * errors and requests refused by route-level permission checks – and VIEW_PAGE
 * when a page renders successfully.
 *
 * Our URLs carry move/person UUIDs rather than prison numbers, so the subject is
 * resolved when the event is sent, after route middleware has loaded the move
 * or person onto the request.
 */
export default function auditPageView(auditService: AuditService) {
  return (req: AuditedRequest, res: Response, next: NextFunction) => {
    const who = req.session?.user?.username

    if (
      req.method !== 'GET' ||
      !who ||
      notPageViews.some(pattern => pattern.test(req.originalUrl))
    ) {
      return next()
    }

    const auditEvent = (what: string): AuditEvent => ({
      what,
      who,
      correlationId: req.transactionId,
      details: detailsOfRequest(req),
      ...subjectOfRequest(req, res),
    })

    res.prependOnceListener('close', () => {
      logPageView(auditService, auditEvent('VIEW_PAGE_ACCESS_ATTEMPT'))
    })

    const render = res.render.bind(res) as Render
    res.render = ((view: string, options?: object, callback?: RenderCallback) => {
      // callers supplying their own callback handle sending themselves
      if (typeof callback === 'function' || typeof options === 'function') {
        return render(view, options, callback)
      }

      render(view, options, (err, html) => {
        if (err) {
          return next(err)
        }

        // send the page first: auditing must never delay or break rendering
        res.send(html)
        logPageView(auditService, auditEvent('VIEW_PAGE'))
      })
    }) as Response['render']

    next()
  }
}

function prisonNumberOfRequest(req: AuditedRequest): string | undefined {
  return req.move?.profile?.person?.prison_number || req.person?.prison_number
}

function subjectOfRequest(req: AuditedRequest, res: Response): Subject {
  const prisonNumber = prisonNumberOfRequest(req)

  if (prisonNumber) {
    return { subjectType: 'PRISONER_ID', subjectId: prisonNumber }
  }

  const { searchTerm } = res.locals

  if (typeof searchTerm === 'string' && searchTerm) {
    return {
      subjectType: 'SEARCH_TERM',
      subjectId: searchTerm.substring(0, maxSubjectIdLength),
    }
  }

  return { subjectType: 'NOT_APPLICABLE' }
}

function detailsOfRequest(req: AuditedRequest): Record<string, string> {
  const details: Record<string, string> = { pageUrl: req.originalUrl }
  const moveId = req.move?.id
  const personId = req.move?.profile?.person?.id || req.person?.id

  // people held in police custody often have no prison number, so record
  // our own identifiers as well to make every view traceable
  if (moveId) {
    details.moveId = moveId
  }

  if (personId) {
    details.personId = personId
  }

  return details
}

function logPageView(auditService: AuditService, event: AuditEvent): void {
  // auditing must not be able to break page rendering, so never throw
  auditService
    .logAuditEvent(event, { throwOnError: false, logOnError: true })
    .catch(error => {
      logger.error('Failed to audit page view', error)
    })
}
