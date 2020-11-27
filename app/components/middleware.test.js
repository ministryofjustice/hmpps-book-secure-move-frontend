const middleware = require('./middleware')

const mockComponents = [
  {
    name: 'mock-component-one',
  },
  {
    name: 'mock-component-two',
  },
]

describe('Components middleware', function () {
  describe('#setComponent()', function () {
    let reqMock, nextSpy

    beforeEach(function () {
      reqMock = {}
      nextSpy = sinon.spy()
    })

    context('when component exists', function () {
      beforeEach(function () {
        middleware.setComponent(mockComponents)(
          reqMock,
          {},
          nextSpy,
          'mock-component-one'
        )
      })

      it('should set component on request', function () {
        expect(reqMock).to.contain.property('component')
        expect(reqMock.component).to.deep.equal({
          name: 'mock-component-one',
        })
      })

      it('should set active component on request', function () {
        expect(reqMock).to.contain.property('activeComponent')
        expect(reqMock.activeComponent).to.equal('mock-component-one')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when component does not exist', function () {
      beforeEach(function () {
        middleware.setComponent(mockComponents)(
          reqMock,
          {},
          nextSpy,
          'non-existent'
        )
      })

      it('should not set component on request', function () {
        expect(reqMock).not.to.contain.property('component')
      })

      it('should not set active component on request', function () {
        expect(reqMock).not.to.contain.property('activeComponent')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('without components', function () {
      beforeEach(function () {
        middleware.setComponent()(reqMock, {}, nextSpy, 'non-existent')
      })

      it('should not set component on request', function () {
        expect(reqMock).not.to.contain.property('component')
      })

      it('should not set active component on request', function () {
        expect(reqMock).not.to.contain.property('activeComponent')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setComponents()', function () {
    let reqMock, nextSpy

    beforeEach(function () {
      reqMock = {}
      nextSpy = sinon.spy()
    })

    context('with components', function () {
      beforeEach(function () {
        middleware.setComponents(mockComponents)(reqMock, {}, nextSpy)
      })

      it('should set component on request', function () {
        expect(reqMock).to.contain.property('components')
        expect(reqMock.components).to.deep.equal(mockComponents)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('without components', function () {
      beforeEach(function () {
        middleware.setComponents()(reqMock, {}, nextSpy)
      })

      it('should set components to empty array', function () {
        expect(reqMock).to.contain.property('components')
        expect(reqMock.components).to.deep.equal([])
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
