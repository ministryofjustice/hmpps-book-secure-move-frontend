import { expect } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

// @ts-ignore / TODO: convert to TS and remove this ignore
import frameworksService from '../../../services/frameworks'
import { Assessment } from '../../../types/assessment'
import { Framework } from '../../../types/framework'
import { FrameworkResponse } from '../../../types/framework_response'
import { FrameworkSection } from '../../../types/framework_section'

const mapQuestionToResponseStub = sinon.stub().callsFake(() => {
  return (response: FrameworkResponse) => {
    return {
      ...response,
      _foo: `bar-${response.id}`,
    }
  }
})
const mapItemToSectionStub = sinon.stub().callsFake(() => {
  return (section: FrameworkSection) => {
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
}).assessmentTransformer

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#assessmentTransformer', function () {
      let assessment: Assessment, mockFramework: Framework

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
          assessment = {
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
          transformer(assessment)
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
          expect(Object.keys(assessment)).to.have.length(4)
        })

        it('should add framework', function () {
          expect(assessment._framework).to.deep.equal({
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
          expect(assessment.responses).to.deep.equal([
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
          expect(mapItemToSectionStub).to.have.been.calledOnceWithExactly(
            assessment
          )
        })
      })

      context('without framework', function () {
        beforeEach(function () {
          assessment = {
            id: '12345',
          }
          transformer(assessment)
        })

        it('should not get framework', function () {
          expect(frameworksService.getFramework).not.to.have.been.called
        })

        it('should not add custom properties', function () {
          expect(assessment).to.deep.equal({
            id: '12345',
          })
        })
      })

      context('when framework is an ID', function () {
        beforeEach(function () {
          assessment = {
            id: '12345',
            framework: '67890' as any,
          }
          transformer(assessment)
        })

        it('should not get framework', function () {
          expect(frameworksService.getFramework).not.to.have.been.called
        })

        it('should not add custom properties', function () {
          expect(assessment).to.deep.equal({
            id: '12345',
            framework: '67890',
          })
        })
      })
    })
  })
})
