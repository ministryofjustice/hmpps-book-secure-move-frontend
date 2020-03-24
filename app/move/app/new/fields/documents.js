const { FILE_UPLOADS } = require('../../../../../config')

const acceptTypes = [
  'image/jpeg',
  'applicattion/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  'application/vnd.ms-word.document.macroEnabled.12',
  'application/vnd.ms-word.template.macroEnabled.12',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.template.macroEnabled.12',
  'application/vnd.ms-excel.addin.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'text/csv',
].join(',')

const documents = {
  id: 'documents',
  name: 'documents',
  component: 'appMultiFileUpload',
  heading: {
    text: 'fields::documents.heading',
  },
  label: {
    text: 'fields::documents.label',
    classes: 'govuk-label--m',
  },
  hint: {
    text: 'fields::documents.hint',
  },
  attributes: {
    accept: acceptTypes,
    'data-max-filesize': `${FILE_UPLOADS.MAX_FILE_SIZE / (1024 * 1024)}Mb`,
  },
}

module.exports = documents
