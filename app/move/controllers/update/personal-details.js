const personService = require('../../../../common/services/person')
const PersonalDetails = require('../create/personal-details')

const UpdateBase = require('./base')

class UpdatePersonalDetailsController extends UpdateBase {
  async saveValues(req, res, next) {
    const person = req.getPerson()

    const identifiers = person.identifiers.map(
      identifier => identifier.identifier_type
    )
    const identifiersData = personService.unformat(person, identifiers)
    req.form.values = {
      ...identifiersData,
      ...req.form.values,
    }

    PersonalDetails.prototype.saveValues.apply(this, [req, res, next])
  }
}

UpdateBase.mixin(UpdatePersonalDetailsController, PersonalDetails)

module.exports = UpdatePersonalDetailsController
