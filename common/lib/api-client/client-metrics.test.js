const proxyquire = require('proxyquire')

const histogramObserver = sinon.stub()
const counterInc = sinon.stub()

const promClient = {
  Histogram: sinon.stub().returns({
    observe: histogramObserver,
  }),
  Counter: sinon.stub().returns({
    inc: counterInc,
  }),
}

const clientMetrics = proxyquire('./client-metrics', {
  '../metrics': {
    getClient: () => promClient,
  },
})

describe('API Client', function () {
  const req = {
    url: 'http://gosh.com/foo/bar',
    method: 'SPLAP',
  }
  const response = { status: 399, statusText: 'Something happened' }
  beforeEach(function () {
    histogramObserver.resetHistory()
    counterInc.resetHistory()
  })
  describe('Client metrics', function () {
    describe('#recordSuccess', function () {
      it('should record the metrics for a successful request', function () {
        clientMetrics.recordSuccess(req, response, 23)
        expect(histogramObserver).to.be.calledOnceWithExactly(
          {
            method: 'SPLAP',
            path: '/foo/bar',
            status: 399,
            status_text: 'Something happened',
          },
          23
        )
      })
    })

    describe('#recordError', function () {
      const error = { response }
      it('should record the metrics for a successful request', function () {
        clientMetrics.recordError(req, error, 23)
        expect(histogramObserver).to.be.calledOnceWithExactly(
          {
            error: true,
            method: 'SPLAP',
            path: '/foo/bar',
            status: 399,
            status_text: 'Something happened',
          },
          23
        )
      })
    })
  })
})
