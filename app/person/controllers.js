const axios = require('axios')

const personService = require('../../common/services/person')
const nunjucksGlobals = require('../../config/nunjucks/globals')

module.exports = {
  image: fallbackImage => {
    return async (req, res) => {
      try {
        const imageUrl = await personService.getImageUrl(req.params.personId)
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
  },
}
