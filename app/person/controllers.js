const axios = require('axios')

const presenters = require('../../common/presenters')
const nunjucksGlobals = require('../../config/nunjucks/globals')

function image(fallbackImage) {
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

function personalDetails(req, res) {
  const fullname = req.person._fullname
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    req.person
  )
  const identityBar = {
    classes: 'sticky',
    caption: {
      text: req.t('person::page_caption'),
    },
    heading: {
      html: req.t('person::page_heading', {
        name: fullname,
      }),
    },
  }

  res
    .breadcrumb({ text: req.t('person::personal_details.heading') })
    .render('person/views/personal-details', {
      fullname,
      identityBar,
      personalDetailsSummary,
    })
}

module.exports = { image, personalDetails }
