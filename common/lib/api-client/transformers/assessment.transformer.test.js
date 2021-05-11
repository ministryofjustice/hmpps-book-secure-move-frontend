const proxyquire = require('proxyquire')

const frameworksService = require('../../../services/frameworks')

const mapQuestionToResponseStub = sinon.stub().callsFake(framework => {
  return response => {
    return {
      ...response,
      _foo: `bar-${response.id}`,
    }
  }
})
const mapItemToSectionStub = sinon.stub().callsFake(data => {
  return section => {
    return {
      ...section,
      _fizz: `buzz-${section.name}`,
    }
  }
})

const transformer = proxyquire('./assessment.transformer', {
  '../../../helpers/frameworks/map-item-to-section': mapItemToSectionStub,
  '../../../helpers/frameworks/map-question-to-response':
    mapQuestionToResponseStub,
})

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#assessmentTransformer', function () {
      let item, mockFramework

      beforeEach(function () {
        mockFramework = {
          name: 'foo',
          version: '1.1.0',
          sections: {
            'section-one': {
              name: 'one',
              steps: [],
            },
            'section-two': {
              name: 'two',
              steps: [],
            },
          },
          questions: {},
        }
        sinon.stub(frameworksService, 'getFramework').returns(mockFramework)
        mapQuestionToResponseStub.resetHistory()
        mapItemToSectionStub.resetHistory()
      })

      context('with framework', function () {
        beforeEach(function () {
          item = {
            id: '12345',
            framework: {
              name: 'framework-name',
              version: '1.1.0',
            },
            responses: [
              {
                id: '1',
                value: 'foo',
              },
              {
                id: '2',
                value: 'bar',
              },
            ],
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
          expect(Object.keys(item)).to.have.length(4)
        })

        it('should add framework', function () {
          expect(item._framework).to.deep.equal({
            name: 'foo',
            version: '1.1.0',
            sections: {
              'section-one': {
                _fizz: 'buzz-one',
                name: 'one',
                steps: [],
              },
              'section-two': {
                _fizz: 'buzz-two',
                name: 'two',
                steps: [],
              },
            },
            questions: {},
          })
        })

        it('should mutate responses', function () {
          expect(item.responses).to.deep.equal([
            {
              id: '1',
              value: 'foo',
              _foo: 'bar-1',
            },
            {
              id: '2',
              value: 'bar',
              _foo: 'bar-2',
            },
          ])
        })

        it('should call responses helpers', function () {
          expect(mapQuestionToResponseStub).to.have.been.calledOnceWithExactly(
            mockFramework
          )
        })

        it('should call sections helpers', function () {
          expect(mapItemToSectionStub).to.have.been.calledOnceWithExactly(item)
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

      context('when framework is an ID', function () {
        beforeEach(function () {
          item = {
            id: '12345',
            framework: '67890',
          }
          transformer(item)
        })

        it('should not get framework', function () {
          expect(frameworksService.getFramework).not.to.have.been.called
        })

        it('should not add custom properties', function () {
          expect(item).to.deep.equal({
            id: '12345',
            framework: '67890',
          })
        })
      })
    })
  })
})
