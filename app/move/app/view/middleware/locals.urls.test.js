const middleware = require('./locals.urls')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsUrls()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          move: {
            id: '__move_12345__',
          },
          baseUrl: '/base-url',
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()
      })

      it('should set urls to locals', function () {
        middleware(req, res, nextSpy)

        expect(res.locals).to.deep.equal({
          urls: {
            move: {
              warnings: '/base-url/warnings',
              details: '/base-url/details',
              timeline: '/base-url/timeline',
              person_escort_record: '/move/__move_12345__/person-escort-record',
              youth_risk_assessment:
                '/move/__move_12345__/youth-risk-assessment',
            },
          },
        })
      })
    })
  })
})
