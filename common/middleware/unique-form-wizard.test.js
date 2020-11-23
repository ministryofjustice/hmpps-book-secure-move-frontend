const proxyquire = require('proxyquire')

const mwStub = sinon.stub().callsFake(() => true)
const hmpoFormWizardStub = sinon.stub().returns(mwStub)
const wizard = proxyquire('./unique-form-wizard', {
  'hmpo-form-wizard': hmpoFormWizardStub,
})

const mockSteps = {
  '/step-one': {},
  '/step-two': {},
}
const mockFields = {
  'field-one': {
    name: 'one',
  },
  'field-two': {
    name: 'two',
  },
}

describe('#uniqueFormWizard', function () {
  let req, res, nextSpy

  beforeEach(function () {
    hmpoFormWizardStub.resetHistory()
    mwStub.resetHistory()
    nextSpy = sinon.spy()
    req = {}
    res = {}
  })

  context('without unique key', function () {
    beforeEach(function () {
      wizard(mockSteps, mockFields, { foo: 'bar' })(req, res, nextSpy)
    })

    it('should call wizard correctly', function () {
      expect(hmpoFormWizardStub).to.be.calledOnceWithExactly(
        mockSteps,
        mockFields,
        { foo: 'bar' }
      )
    })

    it('should wizard with middleware args', function () {
      expect(mwStub).to.be.calledOnceWithExactly(req, res, nextSpy)
    })
  })

  context('with unique key', function () {
    let mockConfig

    beforeEach(function () {
      req = {
        params: {
          id: '12345',
        },
      }
      mockConfig = sinon.stub().callsFake((arg = '') => {
        return { foo: 'bar', id: arg }
      })
    })

    context('with key that exists', function () {
      beforeEach(function () {
        wizard(
          mockSteps,
          mockFields,
          mockConfig,
          'params.id'
        )(req, res, nextSpy)
      })

      it('should call wizard correctly', function () {
        expect(hmpoFormWizardStub).to.be.calledOnceWithExactly(
          mockSteps,
          mockFields,
          {
            foo: 'bar',
            id: '12345',
          }
        )
      })

      it('should wizard with middleware args', function () {
        expect(mwStub).to.be.calledOnceWithExactly(req, res, nextSpy)
      })

      it('should pass unique val to config', function () {
        expect(mockConfig).to.be.calledOnceWithExactly('12345')
      })
    })

    context('with key that does not exist', function () {
      beforeEach(function () {
        wizard(
          mockSteps,
          mockFields,
          mockConfig,
          'path.does.not.exist'
        )(req, res, nextSpy)
      })

      it('should call wizard correctly', function () {
        expect(hmpoFormWizardStub).to.be.calledOnceWithExactly(
          mockSteps,
          mockFields,
          {
            foo: 'bar',
            id: '',
          }
        )
      })

      it('should wizard with middleware args', function () {
        expect(mwStub).to.be.calledOnceWithExactly(req, res, nextSpy)
      })

      it('should not pass unique val to config', function () {
        expect(mockConfig).to.be.calledOnceWithExactly()
      })
    })

    context('when config is an object', function () {
      beforeEach(function () {
        wizard(
          mockSteps,
          mockFields,
          { foo: 'bar' },
          'params.id'
        )(req, res, nextSpy)
      })

      it('should call wizard correctly', function () {
        expect(hmpoFormWizardStub).to.be.calledOnceWithExactly(
          mockSteps,
          mockFields,
          { foo: 'bar' }
        )
      })

      it('should wizard with middleware args', function () {
        expect(mwStub).to.be.calledOnceWithExactly(req, res, nextSpy)
      })
    })
  })
})
