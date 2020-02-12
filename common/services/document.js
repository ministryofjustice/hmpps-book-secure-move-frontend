const FormData = require('form-data')

const apiClient = require('../lib/api-client')()

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

  destroy(id) {
    return Promise.resolve(id)
  },
}

module.exports = documentService
