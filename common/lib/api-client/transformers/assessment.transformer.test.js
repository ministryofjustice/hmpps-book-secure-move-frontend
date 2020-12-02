const frameworksService = require('../../../services/frameworks')

const transformer = require('./assessment.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#assessmentTransformer', function () {
      let item, mockFramework

      beforeEach(function () {
        mockFramework = {
          name: 'foo',
          version: '1.1.0',
        }
        sinon.stub(frameworksService, 'getFramework').returns(mockFramework)
      })

      context('with framework', function () {
        beforeEach(function () {
          item = {
            id: '12345',
            framework: {
              name: 'framework-name',
              version: '1.1.0',
            },
          }
          transformer(item)
        })

        it('should get correct framework', function () {
          expect(
            frameworksService.getFramework
          ).to.have.been.calledOnceWithExactly({
            framework: 'framework-name',
            version: '1.1.0',
          })
        })

        it('should add custom properties', function () {
          expect(item).to.deep.equal({
            id: '12345',
            framework: {
              name: 'framework-name',
              version: '1.1.0',
            },
            _framework: mockFramework,
          })
        })
      })

      context('without framework', function () {
        beforeEach(function () {
          item = {
            id: '12345',
          }
          transformer(item)
        })

        it('should not get framework', function () {
          expect(frameworksService.getFramework).not.to.have.been.called
        })

        it('should not add custom properties', function () {
          expect(item).to.deep.equal({
            id: '12345',
          })
        })
      })
    })
  })
})
