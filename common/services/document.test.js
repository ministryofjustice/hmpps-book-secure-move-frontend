const proxyquire = require('proxyquire')
const axios = require('axios')

const logger = require('../../config/logger')

const mockRequestUrl = 'http://test.com'
const mockAPI = {
  BASE_URL: mockRequestUrl,
  TIMEOUT: 11000000,
}

const authRequest = proxyquire('../lib/api-client/auth-request', {
  './auth': () => new MockAuth(),
  '../../../config': {
    API: mockAPI,
  },
})
const documentService = proxyquire('./document', {
  '../lib/api-client/auth-request': authRequest,
  '../../config': {
    API: mockAPI,
  },
})

const mockToken = '1212121212'
const mockMoveId = '1234566'
const mockDocumentId = '6787679754635235'
const mockDeleteRequestPath = `/moves/${mockMoveId}/documents/${mockDocumentId}`
const mockUploadRequestPath = `/moves/${mockMoveId}/documents`

const mockUploadDir = 'mock/local/upload/directory'
const mockImageFile = {
  name: 'mock-upload-image.png',
  path: `${mockUploadDir}/mock-upload-image.png`,
  fileType: 'image/png',
}

const mockError = {
  response: {
    status: 500,
    statusText: 'something went wrong',
  },
  stack: 'something terrible went wrong',
}

function MockAuth() {}
MockAuth.prototype.getAccessToken = sinon.stub()

describe('document Service', function() {
  const mockResponseMessage = {
    data: {
      id: mockDocumentId,
      type: 'documents',
      attributes: {
        filename: mockImageFile.name,
        file_type: mockImageFile.fileType,
      },
    },
  }
  let response

  describe('#upload', function() {
    beforeEach(function() {
      mockFs({
        'mock/local/upload/directory': {
          'mock-upload-document.doc': 'Mock upload file',
          'mock-upload-image.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
        },
      })

      MockAuth.prototype.getAccessToken.resolves(mockToken)
    })

    context('when uploading an image is successful', function() {
      beforeEach(async function() {
        nock(mockRequestUrl)
          .matchHeader('Authorization', `Bearer ${mockToken}`)
          .matchHeader('content-type', /multipart\/form-data; boundary.*/)
          .post(mockUploadRequestPath)
          .reply(200, JSON.stringify(mockResponseMessage))

        response = await documentService.upload(mockImageFile, mockMoveId)
      })

      it('response should be as expected', function() {
        expect(response).to.deep.equal(mockResponseMessage.data)
      })

      it('should complete uploading an image', function() {
        expect(nock.isDone()).to.be.true
      })
    })

    context('when uploading an image fails', function() {
      beforeEach(async function() {
        sinon.spy(logger, 'error')
        sinon.stub(axios, 'create').returns({
          post: sinon.stub().rejects(mockError),
        })

        await documentService.upload(mockImageFile, mockMoveId)
      })

      it('response should be as expected', function() {
        expect(logger.error).to.be.calledOnce
        expect(logger.error).to.be.calledWithExactly(
          `${mockError.response.status}: ${mockError.response.statusText} Stack: ${mockError.stack}`
        )
      })

      it('should complete uploading an image', function() {
        expect(nock.isDone()).to.be.true
      })
    })
  })

  describe('#delete', function() {
    context('when deleting an image is successful', function() {
      beforeEach(async function() {
        nock(mockRequestUrl)
          .matchHeader('Authorization', `Bearer ${mockToken}`)
          .matchHeader('content-type', 'application/json')
          .delete(mockDeleteRequestPath)
          .reply(200, JSON.stringify(mockResponseMessage))

        response = await documentService.delete(mockMoveId, mockDocumentId)
      })

      it('response should be as expected', function() {
        expect(response).to.deep.equal(mockResponseMessage.data)
      })

      it('should complete uploading an image', function() {
        expect(nock.isDone()).to.be.true
      })
    })

    context('when deleting an image fails', function() {
      beforeEach(async function() {
        sinon.spy(logger, 'error')
        sinon.stub(axios, 'create').returns({
          delete: sinon.stub().rejects(mockError),
        })

        await documentService.delete(mockMoveId, mockDocumentId)
      })

      it('response should be as expected', function() {
        expect(logger.error).to.be.calledOnce
        expect(logger.error).to.be.calledWithExactly(
          `${mockError.response.status}: ${mockError.response.statusText} Stack: ${mockError.stack}`
        )
      })

      it('should complete uploading an image', function() {
        expect(nock.isDone()).to.be.true
      })
    })
  })
})
