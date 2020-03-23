const axios = require('axios')

const personService = require('../../common/services/person')
const nunjucksGlobals = require('../../config/nunjucks/globals')

module.exports = {
  image: (fallbackImage, showImages = false) => {
    return async (req, res) => {
      const imagePath = nunjucksGlobals.getAssetPath(fallbackImage)

      if (!showImages) {
        return res.redirect(imagePath)
      }

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
        res.redirect(imagePath)
      }
    }
  },
}
