const PersonalDetails = require('../create/personal-details')
const UpdateBase = require('./base')

const personService = require('../../../../common/services/person')

class UpdatePersonalDetailsController extends UpdateBase {
  async saveValues(req, res, next) {
    const person = req.getPerson()

    const identifiers = person.identifiers.map(
      identifier => identifier.identifier_type
    )
    const identifiersData = personService.unformat(person, identifiers)
    req.form.values = Object.assign({}, identifiersData, req.form.values)

    PersonalDetails.prototype.saveValues.apply(this, [req, res, next])
  }

  // async saveValues(req, res, next) {
  //   try {
  //     const id = req.getPersonId()
  //     const person = req.getPerson()

  //     const identifiers = person.identifiers.map(
  //       identifier => identifier.identifier_type
  //     )
  //     const identifiersData = personService.unformat(person, identifiers)
  //     const data = Object.assign({}, identifiersData, req.form.values)

  //     req.form.values.person = await this.savePerson(id, data)

  //     next()
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}

UpdateBase.mixin(UpdatePersonalDetailsController, PersonalDetails)

module.exports = UpdatePersonalDetailsController
