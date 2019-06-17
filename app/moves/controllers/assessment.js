const FormController = require('./form')
const referenceDataService = require('../../../common/services/reference-data')

function _referenceToItem (item) {
  return {
    value: item.id,
    text: item.title,
  }
}

class AssessmentController extends FormController {
  async configure (req, res, next) {
    try {
      const { fields } = req.form.options

      await Promise
        .all(Object.keys(fields).map((key) => {
          const field = fields[key]

          if (!field.hasOwnProperty('items')) {
            return
          }

          return referenceDataService
            .getAssessmentQuestions(key)
            .then((response) => {
              field.items = response.map(_referenceToItem)
            })
        }))

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AssessmentController
