const frameworksService = require('../../../services/frameworks')

const transformer = require('./person-escort-record.transformer')

describe('API Client', function () {
  describe('Transformers', function () {
    describe('#personEscortRecordTransformer', function () {
      let output, item, mockFramework

      beforeEach(function () {
        mockFramework = {
          name: 'foo',
          version: '1.1.0',
        }
        sinon
          .stub(frameworksService, 'getPersonEscortRecord')
          .returns(mockFramework)
        item = {
          id: '12345',
          version: '1.1.0',
        }
        output = transformer(item)
      })

      it('should add custom properties', function () {
        expect(output).to.deep.equal({
          ...item,
          _framework: mockFramework,
        })
      })
    })
  })
})
