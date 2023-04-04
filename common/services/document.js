const FormData = require('form-data')

const { BaseService } = require('./base')

class DocumentService extends BaseService {
  create(file, data) {
    const formData = new FormData()
    formData.append('data[attributes][file]', data, {
      filename: file.originalname,
      knownLength: file.size,
    })

    return this.apiClient
      .create('document', formData)
      .then(response => response.data)
  }
}

module.exports = DocumentService
