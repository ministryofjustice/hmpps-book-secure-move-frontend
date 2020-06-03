const proxyquire = require('proxyquire')

function MockFormData() {}

MockFormData.prototype.append = sinon.stub()

const documentService = proxyquire('./document', {
  'form-data': MockFormData,
})
const apiClient = require('../lib/api-client')()

describe('Document Service', function() {
  describe('#create()', function() {
    const mockFileData = {
      originalname: 'Original filename',
      size: 100100,
    }
    const mockBuffer = 'buffer'
    const mockResponse = {
      data: {
        filename: 'Original filename',
        filesize: 100100,
      },
    }
    let document

    beforeEach(async function() {
      sinon.stub(apiClient, 'create').resolves(mockResponse)

      document = await documentService.create(mockFileData, mockBuffer)
    })

    it('should append file data to form data', function() {
      const args = MockFormData.prototype.append.args[0]

      expect(args[0]).to.equal('data[attributes][file]')
      expect(args[1]).to.deep.equal(mockBuffer)
      expect(args[2]).to.deep.equal({
        filename: mockFileData.originalname,
        knownLength: mockFileData.size,
      })
    })

    it('should call create method with form data', function() {
      const args = apiClient.create.args[0]

      expect(args[0]).to.equal('document')
      expect(args[1]).to.be.an.instanceOf(MockFormData)
    })

    it('should return data property', function() {
      expect(document).to.deep.equal(mockResponse.data)
    })
  })
})
