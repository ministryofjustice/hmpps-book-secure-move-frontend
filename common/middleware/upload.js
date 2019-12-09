const formidable = require('formidable')

function parseMultipartForm(req, res, next) {
  if (
    req.method.toLowerCase() !== 'post' &&
    req.get('content-type') !== 'multipart/form-data'
  ) {
    return next()
  }

  const form = new formidable.IncomingForm()
  form.multiples = true
  form.maxFileSize = 10 * 1024 * 1024 // 10 meg

  form.parse(req, (error, fields, files) => {
    if (error) {
      return next(error)
    }

    req.body = {
      ...req.body,
      ...fields,
      files: [files.file].flat(),
    }

    return next()
  })
}

module.exports = {
  parseMultipartForm,
}
