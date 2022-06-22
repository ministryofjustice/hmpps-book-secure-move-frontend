const proxyquire = require('proxyquire')

const i18n = require('../../../config/i18n').default
const frameworkNomisMappingsToPanelStub = sinon.stub().returns('STUB_MAPPINGS')
const helper = proxyquire('./render-nomis-mappings-to-field', {
  '../../presenters/framework-nomis-mappings-to-panel':
    frameworkNomisMappingsToPanelStub,
})

describe('#renderNomisMappingsToField', function () {
  let output
  const mockField = [
    'mock-key',
    {
      foo: 'bar',
    },
  ]

  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
  })

  context('without response', function () {
    beforeEach(function () {
      output = helper()(mockField)
    })

    it('should return original field', function () {
      expect(output).to.deep.equal(mockField)
    })
  })

  context('with response', function () {
    const mockResponse = {
      question: {
        key: 'mock-key',
      },
    }

    context('without NOMIS mappings', function () {
      beforeEach(function () {
        output = helper([mockResponse])(mockField)
      })

      it('should return original field', function () {
        expect(output).to.deep.equal(mockField)
      })
    })

    context('with NOMIS mappings', function () {
      const mockResponseWithMappings = {
        ...mockResponse,
        nomis_mappings: [{ foo: 'bar' }, { fizz: 'buzz' }],
        assessment: {
          created_at: '2020-10-10T14:22:00Z',
        },
      }

      context('without existing hint text', function () {
        beforeEach(function () {
          output = helper([mockResponseWithMappings])(mockField)
        })

        it('should call presenter', function () {
          expect(frameworkNomisMappingsToPanelStub).to.be.calledWithExactly({
            heading:
              'person-escort-record::nomis_mappings.information_to_be_included',
            updatedAt: mockResponseWithMappings.assessment.created_at,
            mappings: mockResponseWithMappings.nomis_mappings,
          })
        })

        it('should app properties to field', function () {
          expect(output).to.deep.equal([
            mockField[0],
            {
              ...mockField[1],
              hint: {
                classes: 'markdown',
                html: 'STUB_MAPPINGS',
              },
            },
          ])
        })
      })

      context('with existing hint text', function () {
        const mockFieldWithHint = [
          'mock-key',
          {
            foo: 'bar',
            hint: {
              html: 'EXISTING_HINT',
            },
          },
        ]

        beforeEach(function () {
          output = helper([mockResponseWithMappings])(mockFieldWithHint)
        })

        it('should call presenter', function () {
          expect(frameworkNomisMappingsToPanelStub).to.be.calledWithExactly({
            heading:
              'person-escort-record::nomis_mappings.information_to_be_included',
            updatedAt: mockResponseWithMappings.assessment.created_at,
            mappings: mockResponseWithMappings.nomis_mappings,
          })
        })

        it('should app properties to field', function () {
          expect(output).to.deep.equal([
            mockFieldWithHint[0],
            {
              ...mockFieldWithHint[1],
              hint: {
                classes: 'markdown',
                html: 'EXISTING_HINTSTUB_MAPPINGS',
              },
            },
          ])
        })
      })
    })
  })
})
