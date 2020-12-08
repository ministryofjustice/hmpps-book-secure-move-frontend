const { ObjectReadableMock } = require('stream-mock')

const documentService = {
  create: sinon.stub(),
}

const APIDocumentStorage = require('./multer.api-document.storage')()

const mockServiceResponse = {
  id: '12345',
  filename: 'filename.jpg',
}

describe('Multer Document Storage Engine', function () {
  let mockReq, mockFile

  beforeEach(function () {
    mockReq = {
      services: {
        document: documentService,
      },
    }
    mockFile = {
      stream: new ObjectReadableMock([1, 2, 3]),
    }
  })

  describe('#_handleFile()', function () {
    context('when document service resolves', function () {
      beforeEach(function () {
        documentService.create.resolves(mockServiceResponse)
      })

      it('should call callback with correct arguments', function (done) {
        function callback(error, document) {
          expect(error).to.be.null
          expect(document).to.deep.equal(mockServiceResponse)
          done()
        }

        APIDocumentStorage._handleFile(mockReq, mockFile, callback)
      })
    })

    context('when document service errors', function () {
      const error = new Error('Document error')

      beforeEach(function () {
        documentService.create.rejects(error)
      })

      it('should call callback with error', function (done) {
        function callback(error) {
          expect(error.name).to.equal('MulterError')
          expect(error.message).to.equal('Document error')
          expect(error.code).to.equal('API_DOCUMENT_STORAGE_FAILED')
          done()
        }

        APIDocumentStorage._handleFile(mockReq, mockFile, callback)
      })
    })
  })

  describe('#_removeFile()', function () {
    it('should call callback with error', function (done) {
      function callback(error) {
        expect(error).to.be.null
        done()
      }

      APIDocumentStorage._removeFile(mockReq, mockFile, callback)
    })
  })
})
