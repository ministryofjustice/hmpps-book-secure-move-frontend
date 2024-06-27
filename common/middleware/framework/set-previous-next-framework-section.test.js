const middleware = require('./set-previous-next-framework-section')

describe('Framework middleware', function () {
  describe('#setPreviousNextFrameworkSection', function () {
    let req, res, nextSpy

    const mockSections = {
      'health-information': {
        key: 'health-information',
        name: 'Health information',
        order: 2,
      },
      'offence-information': {
        key: 'offence-information',
        name: 'Offence information',
        order: 4,
      },
      'property-information': {
        key: 'property-information',
        name: 'Property information',
        order: 3,
      },
      'risk-information': {
        key: 'risk-information',
        name: 'Risk information',
        order: 1,
      },
    }

    beforeEach(function () {
      nextSpy = sinon.spy()

      req = {
        assessment: {
          sections: mockSections,
        },
        frameworkSection: {},
      }

      res = {}
    })

    context('when current section is first section', function () {
      beforeEach(function () {
        req.frameworkSection.key = 'risk-information'
        req.baseUrl = `/move/person-escort-record/${req.frameworkSection.key}`

        middleware(req, res, nextSpy)
      })

      it('should not set the previous section', function () {
        expect(req.previousFrameworkSection).to.be.null
      })

      it('should set the next section', function () {
        expect(req.nextFrameworkSection).to.deep.equal(
          mockSections['health-information']
        )
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when current section is middle section', function () {
      beforeEach(function () {
        req.frameworkSection.key = 'property-information'
        req.baseUrl = `/move/person-escort-record/${req.frameworkSection.key}`

        middleware(req, res, nextSpy)
      })

      it('should set the previous section', function () {
        expect(req.previousFrameworkSection).to.deep.equal(
          mockSections['health-information']
        )
      })

      it('should set the next section', function () {
        expect(req.nextFrameworkSection).to.deep.equal(
          mockSections['offence-information']
        )
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when current section is last section', function () {
      beforeEach(function () {
        req.frameworkSection.key = 'offence-information'
        req.baseUrl = `/move/person-escort-record/${req.frameworkSection.key}`

        middleware(req, res, nextSpy)
      })

      it('should set the previous section', function () {
        expect(req.previousFrameworkSection).to.deep.equal(
          mockSections['property-information']
        )
      })

      it('should not set the next section', function () {
        expect(req.nextFrameworkSection).to.be.null
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
