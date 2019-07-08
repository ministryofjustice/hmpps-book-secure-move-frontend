const proxyquire = require('proxyquire').noCallThru()

const successfulDependency = {
  name: 'successful',
  healthcheck: () => {
    return new Promise((resolve, reject) => {
      resolve('OK')
    })
  },
}
const unsuccessfulDependency = {
  name: 'unsuccessful',
  healthcheck: () => {
    return new Promise((resolve, reject) => {
      reject(new Error('Service error'))
    })
  },
}

describe('Healthcheck middleware', function () {
  describe('#checkDependencies()', function () {
    let resMock, nextSpy

    beforeEach(function () {
      resMock = {}
      nextSpy = sinon.spy()
    })

    context('when check is successful', function () {
      beforeEach(async function () {
        const middleware = proxyquire('./middleware', {
          './dependencies': [successfulDependency],
        })

        await middleware.checkDependencies({}, resMock, nextSpy)
      })

      it('should set dependencies property', function () {
        expect(resMock).to.contain.property('dependencies')
        expect(resMock.dependencies).to.deep.equal([
          {
            name: 'successful',
            status: 'OK',
          },
        ])
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when check fails', function () {
      beforeEach(async function () {
        const middleware = proxyquire('./middleware', {
          './dependencies': [unsuccessfulDependency],
        })

        await middleware.checkDependencies({}, resMock, nextSpy)
      })

      it('should set dependencies property', function () {
        expect(resMock).to.contain.property('dependencies')
        expect(resMock.dependencies).to.deep.equal([
          {
            name: 'unsuccessful',
            status: 'Service unavailable',
            error: 'Service error',
          },
        ])
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when something errors', function () {
      beforeEach(async function () {
        const middleware = proxyquire('./middleware', {
          './dependencies': {},
        })

        await middleware.checkDependencies({}, resMock, nextSpy)
      })

      it('should not set dependencies property', function () {
        expect(resMock).not.to.contain.property('dependencies')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy.args[0][0]).to.be.an.instanceOf(Error)
        expect(nextSpy.args[0][0].message).to.equal(
          'dependencies.map is not a function'
        )
      })
    })
  })
})
