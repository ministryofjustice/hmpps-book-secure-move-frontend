const fs = require('fs')
const FormData = require('form-data')

const logger = require('../../config/logger')

const authRequest = require('../lib/api-client/auth-request')
const { API } = require('../../config')

const logErrorMessage = error => {
  const response = error.response
  logger.error(
    `${response.status}: ${response.statusText} Stack: ${error.stack}`
  )
}

const documentService = {
  async upload(file, moveId) {
    const formData = new FormData()
    const stream = fs.createReadStream(file.path)

    formData.append('data[attributes][file]', stream, {
      filename: file.name,
      knownLength: fs.statSync(file.path).size,
    })
    const authorisedRequest = await authRequest()

    return authorisedRequest
      .post(`/moves/${moveId}/documents`, formData, {
        maxContentLength: API.MAX_FILE_UPLOAD_SIZE,
        maxBodyLength: API.MAX_FILE_UPLOAD_SIZE,
        headers: {
          ...formData.getHeaders(),
          'Content-Length': formData.getLengthSync(),
        },
      })
      .then(response => response.data.data)
      .catch(logErrorMessage)
  },

  async delete(moveId, documentId) {
    const authorisedRequest = await authRequest()

    return authorisedRequest
      .delete(`${API.BASE_URL}/moves/${moveId}/documents/${documentId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data.data)
      .catch(logErrorMessage)
  },
}

module.exports = documentService
