const middleware = require('./redirect-base-url')

describe('Population middleware', function () {
  describe('#redirectBaseUrl()', function () {
    const mockMoveDate = '2019-10-10'
    let req, res

    beforeEach(function () {
      this.clock = sinon.useFakeTimers(new Date(mockMoveDate).getTime())
      req = {
        baseUrl: '/population',
        canAccess: sinon.stub().returns(false),
        session: {},
      }
      res = {
        redirect: sinon.stub(),
      }

      middleware(req, res)
    })

    afterEach(function () {
      this.clock.restore()
    })

    it('should redirect to population dashboard for today', function () {
      expect(res.redirect).to.have.been.calledOnceWithExactly(
        `/population/week/${mockMoveDate}`
      )
    })
  })
})
