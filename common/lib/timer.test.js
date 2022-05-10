const proxyquire = require('proxyquire')

const convertHrtime = sinon.stub().returns({
  seconds: 0.023,
  milliseconds: 23,
  nanoseconds: 23000000,
})

const timer = proxyquire('./timer', {
  'convert-hrtime': convertHrtime,
})

describe('', function () {
  let result
  beforeEach(function () {
    convertHrtime.resetHistory()
  })
  describe('High resolution', function () {
    context('when called with seconds', function () {
      it('should return expected value', function () {
        result = timer(true)('seconds')
        expect(result).to.equal(0.023)
      })
    })

    context('when called with s', function () {
      it('should return expected value', function () {
        result = timer(true)('s')
        expect(result).to.equal(0.023)
      })
    })

    context('when called with milliseconds', function () {
      it('should return expected value', function () {
        result = timer(true)('milliseconds')
        expect(result).to.equal(23)
      })
    })

    context('when called with ms', function () {
      it('should return expected value', function () {
        result = timer(true)('ms')
        expect(result).to.equal(23)
      })
    })

    context('when called with nanoseconds', function () {
      it('should return expected value', function () {
        result = timer(true)('nanoseconds')
        expect(result).to.equal(23000000)
      })
    })

    context('when called with ns', function () {
      it('should return expected value', function () {
        result = timer(true)('ns')
        expect(result).to.equal(23000000)
      })
    })

    context('when called with no unit', function () {
      it('should return seconds value', function () {
        result = timer(true)()
        expect(result).to.equal(0.023)
      })
    })
  })

  describe('Normal resolution', function () {
    let clock
    let testTimer
    beforeEach(function () {
      clock = sinon.useFakeTimers({
        now: 1483228800000,
      })
      testTimer = timer()
      clock.restore()
      clock = sinon.useFakeTimers({
        now: 1483228800023,
      })
    })
    afterEach(function () {
      clock.restore()
    })

    context('when called with seconds', function () {
      it('should return expected value', function () {
        result = testTimer('seconds')
        expect(result).to.equal(0.023)
      })
    })

    context('when called with s', function () {
      it('should return expected value', function () {
        result = testTimer('s')
        expect(result).to.equal(0.023)
      })
    })

    context('when called with milliseconds', function () {
      it('should return expected value', function () {
        result = testTimer('milliseconds')
        expect(result).to.equal(23)
      })
    })

    context('when called with ms', function () {
      it('should return expected value', function () {
        result = testTimer('ms')
        expect(result).to.equal(23)
      })
    })

    context('when called with nanoseconds', function () {
      it('should return expected value', function () {
        result = testTimer('nanoseconds')
        expect(result).to.equal(23000000)
      })
    })

    context('when called with ns', function () {
      it('should return expected value', function () {
        result = testTimer('ns')
        expect(result).to.equal(23000000)
      })
    })

    context('when called with no unit', function () {
      it('should return seconds value', function () {
        result = testTimer()
        expect(result).to.equal(0.023)
      })
    })
  })
})
