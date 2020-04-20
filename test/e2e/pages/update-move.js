import { Selector, t } from 'testcafe'
import CreateMovePage from './create-move'
import MoveDetailPage from './move-detail'

const moveDetailPage = new MoveDetailPage()

class UpdateMovePage extends CreateMovePage {
  constructor(id) {
    super()
    this.url = `/move/${id}/edit`
    this.fields = {
      ...this.fields,
      policeNationalComputerReadOnly: Selector(
        '[type=hidden][name=police_national_computer]'
      ),
      policeNationalComputerHeading: Selector('.app-read-only-field__heading'),
      policeNationalComputerValue: Selector('.app-read-only-field__value'),
    }
  }

  // /**
  //  * Fill in personal details
  //  *
  //  * @param {Object} options - fields to include or exclude
  //  * @param {Array} options.include - fields to include
  //  * @param {Array} options.exclude - fields to exclude
  //  * @returns {Promise<FormDetails>} - filled in personal details
  //  */
  // async fillInPersonalDetails(options = {}) {
  //   super.fillInPersonalDetails({}, options)
  // }
}

UpdateMovePage.gotoPersonalDetails = async () => {
  const { move } = t.ctx

  await moveDetailPage.clickUpdateLink('personal_details')
  return new UpdateMovePage(move.id)
}

UpdateMovePage.updatePersonalDetails = async options => {
  const { person } = t.ctx
  const updateMovePage = await UpdateMovePage.gotoPersonalDetails()
  const updatedFields = await updateMovePage.fillInPersonalDetails({}, options)
  const updatedDetails = { ...person, ...updatedFields }

  await updateMovePage.submitForm()

  await moveDetailPage.checkPersonalDetails(updatedDetails)
}

export default UpdateMovePage
