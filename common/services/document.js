const FormData = require('form-data')

const ApiClient = require('../lib/api-client')

const addRequestContext = req => {
  const apiClient = ApiClient(req)

  const documentService = {
    create(file, data) {
      const formData = new FormData()
      formData.append('data[attributes][file]', data, {
        filename: file.originalname,
        knownLength: file.size,
      })

      return apiClient
        .create('document', formData)
        .then(response => response.data)
    },
  }
  return documentService
}

const documentService = addRequestContext()
documentService.addRequestContext = addRequestContext

module.exports = documentService
