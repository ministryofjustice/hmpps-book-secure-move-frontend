const { isEqual, pick } = require('lodash')

const personService = require('../../../../common/services/person')
const PersonalDetails = require('../create/personal-details')

const UpdateBase = require('./base')

class UpdatePersonalDetailsController extends UpdateBase {
  async saveValues(req, res, next) {
    try {
      const person = req.getPerson()
      const fields = req.form.options.fields
      const fieldKeys = Object.keys(fields).filter(
        key =>
          !fields[key].readOnly || !personService.unformat(person, [key])[key]
      )
      const oldData = personService.unformat(person, fieldKeys, { date: [] })
      const newData = pick(req.form.values, fieldKeys)

      if (!isEqual(newData, oldData)) {
        const id = req.getPersonId()

        await personService.update({
          id,
          ...newData,
        })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

UpdateBase.mixin(UpdatePersonalDetailsController, PersonalDetails)

module.exports = UpdatePersonalDetailsController
