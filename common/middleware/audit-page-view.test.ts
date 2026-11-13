import { AddressInfo } from 'net'
import { Server } from 'http'

import { expect } from 'chai'
import express from 'express'
import sinon from 'sinon'

import auditPageView from './audit-page-view'

const renderedHtml = '<html lang="en">page</html>'

const person = { id: 'person-uuid', prison_number: 'A1234BC' }
const move = { id: 'move-uuid', profile: { person } }

/**
 * Minimal app mirroring server.js ordering: session user first, then the
 * audit middleware, then routes. `res.render` is stubbed *before* the audit
 * middleware so that the middleware wraps the stub, as it wraps nunjucks.
 */
function appWithAuditing(
  auditService: any,
  {
    username = 'user1' as string | null,
    renderFails = false,
  }: { username?: string | null; renderFails?: boolean } = {}
) {
  const app = express()

  app.use((req: any, res: any, next) => {
    req.transactionId = 'request123'
    req.session = username ? { user: { username } } : {}
    res.render = (
      _view: string,
      options?: any,
      callback?: (err: Error | null, html?: string) => void
    ) => {
      const error = renderFails ? new Error('render failed') : null

      if (callback) {
        return callback(error, renderedHtml)
      }

      return error ? next(error) : res.send(renderedHtml)
    }
    next()
  })

  app.use(auditPageView(auditService))

  app.get('/move/:moveId', (req: any, res) => {
    req.move = move
    res.render('move/view')
  })
  app.get('/person/:personId', (req: any, res) => {
    req.person = person
    res.render('person/view')
  })
  app.get('/person/:personId/image', (req, res) => {
    res.send('image')
  })
  app.get('/search', (req, res) => {
    res.locals.searchTerm = req.query.term
    res.render('search')
  })
  app.get('/moves', (req, res) => res.render('moves'))
  app.get('/redirect', (req, res) => res.redirect('/moves'))
  app.post('/moves', (req, res) => res.render('moves'))
  app.get('/own-callback', (req, res) =>
    res.render('moves', {}, (err: Error, html: string) =>
      res.send(`custom ${html}`)
    )
  )

  app.use(
    (
      _error: Error,
      _req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: express.NextFunction
    ) => {
      res.status(500).send('error')
    }
  )

  return app
}

describe('auditPageView middleware', function () {
  let auditService: { logAuditEvent: sinon.SinonStub }
  let server: Server

  async function get(
    path: string,
    options?: Parameters<typeof appWithAuditing>[1],
    method = 'GET'
  ) {
    server = appWithAuditing(auditService, options).listen(0)
    const { port } = server.address() as AddressInfo
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      redirect: 'manual',
    })
    const body = await response.text()
    // the access attempt is only sent once the response has closed
    await new Promise(resolve => setTimeout(resolve, 20))

    return { status: response.status, body }
  }

  function loggedEvents() {
    return auditService.logAuditEvent.args.map(([event]) => ({
      what: event.what,
      subjectType: event.subjectType,
      subjectId: event.subjectId,
    }))
  }

  beforeEach(function () {
    auditService = { logAuditEvent: sinon.stub().resolves() }
  })

  afterEach(function () {
    server?.close()
  })

  it('logs a page view and an access attempt when a page renders', async function () {
    const { status, body } = await get('/move/move-uuid')

    expect(status).to.equal(200)
    expect(body).to.equal(renderedHtml)
    expect(loggedEvents()).to.deep.equal([
      { what: 'VIEW_PAGE', subjectType: 'PRISONER_ID', subjectId: 'A1234BC' },
      {
        what: 'VIEW_PAGE_ACCESS_ATTEMPT',
        subjectType: 'PRISONER_ID',
        subjectId: 'A1234BC',
      },
    ])
  })

  it('passes the username, correlation id and details to the audit service', async function () {
    await get('/move/move-uuid')

    expect(auditService.logAuditEvent).to.have.been.calledWith(
      sinon.match({
        who: 'user1',
        correlationId: 'request123',
        details: {
          pageUrl: '/move/move-uuid',
          moveId: 'move-uuid',
          personId: 'person-uuid',
        },
      }),
      { throwOnError: false, logOnError: true }
    )
  })

  it('uses the prison number of a person page', async function () {
    await get('/person/person-uuid')

    expect(loggedEvents()[0]).to.deep.equal({
      what: 'VIEW_PAGE',
      subjectType: 'PRISONER_ID',
      subjectId: 'A1234BC',
    })
  })

  it('uses the search term when there is no prisoner', async function () {
    await get('/search?term=Jones')

    expect(loggedEvents()[0]).to.deep.equal({
      what: 'VIEW_PAGE',
      subjectType: 'SEARCH_TERM',
      subjectId: 'Jones',
    })
  })

  it('truncates long search terms', async function () {
    await get(`/search?term=${'a'.repeat(100)}`)

    expect(loggedEvents()[0].subjectId).to.have.length(80)
  })

  it('has no subject for a page about neither', async function () {
    await get('/moves')

    expect(loggedEvents()[0]).to.deep.equal({
      what: 'VIEW_PAGE',
      subjectType: 'NOT_APPLICABLE',
      subjectId: undefined,
    })
  })

  it('logs only an attempt when a request does not render a page', async function () {
    const { status } = await get('/redirect')

    expect(status).to.equal(302)
    expect(loggedEvents()).to.deep.equal([
      {
        what: 'VIEW_PAGE_ACCESS_ATTEMPT',
        subjectType: 'NOT_APPLICABLE',
        subjectId: undefined,
      },
    ])
  })

  it('does not audit person images', async function () {
    await get('/person/person-uuid/image')

    expect(auditService.logAuditEvent).not.to.have.been.called
  })

  it('does not audit non-GET requests', async function () {
    await get('/moves', undefined, 'POST')

    expect(auditService.logAuditEvent).not.to.have.been.called
  })

  it('does not audit when there is no signed-in user', async function () {
    await get('/moves', { username: null })

    expect(auditService.logAuditEvent).not.to.have.been.called
  })

  it('leaves renders with their own callback alone', async function () {
    const { body } = await get('/own-callback')

    expect(body).to.equal(`custom ${renderedHtml}`)
    expect(loggedEvents().map(({ what }) => what)).to.deep.equal([
      'VIEW_PAGE_ACCESS_ATTEMPT',
    ])
  })

  it('still serves the page when auditing fails', async function () {
    auditService.logAuditEvent.rejects(new Error('SQS is down'))

    const { status, body } = await get('/move/move-uuid')

    expect(status).to.equal(200)
    expect(body).to.equal(renderedHtml)
  })

  it('passes render errors to the error handler', async function () {
    const { status } = await get('/move/move-uuid', { renderFails: true })

    expect(status).to.equal(500)
  })
})
