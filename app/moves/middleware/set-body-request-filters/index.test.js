const proxyquire = require('proxyquire')

const ageFilterStub = sinon.stub().returns({ foo: 'bar' })
const setBodyRequestFilters = proxyquire('./index', {
  './age': ageFilterStub,
})

describe('setBodyRequestFilters middleware', function () {
  let req
  let res
  let next
  beforeEach(function () {
    ageFilterStub.resetHistory()
    req = {
      query: {},
      body: {},
    }
    res = {}
    next = sinon.stub()
  })
  describe('age filter', function () {
    context('when called', function () {
      beforeEach(function () {
        setBodyRequestFilters(req, res, next)
      })
      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })

      it('should set the requested property on the body object', function () {
        expect(req.body.requested).to.deep.equal({ foo: 'bar' })
      })
    })

    context('when called without a value for age', function () {
      beforeEach(function () {
        setBodyRequestFilters(req, res, next)
      })

      it('should pass undefined to the age filter', function () {
        expect(ageFilterStub).to.be.calledOnceWithExactly(undefined)
      })
    })

    context('when called with a value for age', function () {
      beforeEach(function () {
        req.query.age = 'veryold'
        setBodyRequestFilters(req, res, next)
      })

      it('should pass the age to the age filter', function () {
        expect(ageFilterStub).to.be.calledOnceWithExactly('veryold')
      })
    })
  })
})
