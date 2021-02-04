const axios = require('axios')

const nunjucksGlobals = require('../../../config/nunjucks/globals')

module.exports = fallbackImage => {
  return async (req, res) => {
    try {
      const useOld = false
      const imageUrl = await req.services.person.getImageUrl(
        req.params.personId
      )

      if (useOld) {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        })

        res.writeHead(200, {
          'Content-Type': response.headers['content-type'],
        })
        res.end(response.data, 'binary')
      } else {
        axios({
          method: 'get',
          url: imageUrl,
          responseType: 'stream',
        }).then(function (response) {
          res.writeHead(200, {
            'Content-Type': response.headers['content-type'],
            'Content-Length': response.headers['content-length'],
            ETag: response.headers.etag,
            'Last-Modified': response.headers['last-modified'],
          })

          response.data.on('end', function () {})
          response.data.on('error', function () {
            // This won't work, because we've already started streaming
            const imagePath = nunjucksGlobals.getAssetPath(fallbackImage)
            res.redirect(imagePath)
          })

          response.data.pipe(res)
        })
      }
    } catch (error) {
      const imagePath = nunjucksGlobals.getAssetPath(fallbackImage)
      res.redirect(imagePath)
    }
  }
}
