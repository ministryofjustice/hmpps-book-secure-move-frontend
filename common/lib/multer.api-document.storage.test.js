const { ObjectReadableMock } = require('stream-mock')

const APIDocumentStorage = require('./multer.api-document.storage')()
const documentService = require('../services/document')

const mockServiceResponse = {
  id: '12345',
  filename: 'filename.jpg',
}

describe('Multer Document Storage Engine', function() {
  let mockReq, mockFile

  beforeEach(function() {
    mockReq = {}
    mockFile = {
      stream: new ObjectReadableMock([1, 2, 3]),
    }
  })

  describe('#_handleFile()', function() {
    context('when document service resolves', function() {
      beforeEach(function() {
        sinon.stub(documentService, 'create').resolves(mockServiceResponse)
      })

      it('should call callback with correct arguments', function(done) {
        function callback(error, document) {
          expect(error).to.be.null
          expect(document).to.deep.equal(mockServiceResponse)
          done()
        }

        APIDocumentStorage._handleFile(mockReq, mockFile, callback)
      })
    })

    context('when document service errors', function() {
      const error = new Error('Document error')

      beforeEach(function() {
        sinon.stub(documentService, 'create').rejects(error)
      })

      it('should call callback with error', function(done) {
        function callback(error) {
          expect(error).to.equal(error)
          done()
        }

        APIDocumentStorage._handleFile(mockReq, mockFile, callback)
      })
    })
  })

  describe('#_removeFile()', function() {
    it('should call callback with error', function(done) {
      function callback(error) {
        expect(error).to.be.null
        done()
      }

      APIDocumentStorage._removeFile(mockReq, mockFile, callback)
    })
  })
})
