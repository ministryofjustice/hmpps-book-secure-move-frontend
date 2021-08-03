const axios = require('axios')

const nunjucksGlobals = require('../../../config/nunjucks/globals')

module.exports = fallbackImage => {
  return async (req, res) => {
    try {
      const imageUrl = await req.services.person.getImageUrl(
        req.params.personId
      )
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      })

      res.writeHead(200, {
        'Content-Type': response.headers['content-type'],
      })
      res.end(response.data, 'binary')
    } catch (error) {
      const imagePath = nunjucksGlobals.getAssetPath(fallbackImage)
      res.redirect(imagePath)
    }
  }
}
