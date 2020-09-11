import { Selector, t } from 'testcafe'

import moveToMetaListComponent from '../../../common/presenters/move-to-meta-list-component'
import filters from '../../../config/nunjucks/filters'

import Page from './page'

class MoveDetailPage extends Page {
  constructor() {
    super()

    this.nodes = {
      ...this.nodes,
      title: Selector('#main-content > header > h1'),
      subTitle: Selector('#main-content > header > span'),
      cancelLink: Selector('.app-link--destructive').withText(
        'Cancel this move'
      ),
      tagList: Selector('header [data-tag-list-source]'),
      tags: Selector('header a.app-tag'),
      personalDetails: Selector('#main-content h2')
        .withText('Personal details')
        .sibling('dl'),
      moveDetails: Selector('.sticky-sidebar .app-meta-list'),
      courtInformationHeading: Selector('#main-content h2').withText(
        'Information for the court'
      ),
      courtInformation: Selector('#main-content h2')
        .withText('Information for the court')
        .sibling('dl'),
      noCourtInformationMessage: Selector('.app-message').withText(
        'No information for the court'
      ),
      noCourtHearingsMessage: Selector('.app-message').withText(
        'No court hearings'
      ),
      riskInformation: Selector('#main-content h2')
        .withText('Risk information')
        .parent('section'),
      noRiskInformationMessage: Selector('.app-message').withText(
        'No risk information'
      ),
      healthInformation: Selector('#main-content h2')
        .withText('Health information')
        .parent('section'),
      noHealthInformationMessage: Selector('.app-message').withText(
        'No health information'
      ),
      offenceInformation: Selector('#main-content h2')
        .withText('Offence information')
        .parent('section'),
      propertyInformation: Selector('#main-content h2')
        .withText('Property information')
        .parent('section'),
      documentList: Selector('#main-content h2')
        .withText('Supporting documents')
        .sibling('.govuk-list'),
      noDocumentsMessage: Selector('.app-message').withText(
        'No documents uploaded'
      ),
      personEscortRecordSectionStatuses: this.nodes.instructionBanner.find(
        '.govuk-tag'
      ),
      personEscortRecordSectionLinks: Selector('#main-content a').withText(
        'Review'
      ),
      personEscortRecordWarnings: Selector('#main-content strong.app-tag'),
      personEscortRecordStartButton: this.nodes.instructionBanner
        .find('.govuk-button')
        .withText('Start Person Escort Record'),
      personEscortRecordConfirmationButton: this.nodes.instructionBanner
        .find('.govuk-button')
        .withText('Provide confirmation'),
      personEscortRecordConfirmationCheckbox: Selector(
        '[name="confirm_person_escort_record"]'
      ),
      getUpdateLink: category => {
        return Selector(`[data-update-link="${category}"]`)
      },
    }
  }

  checkHeader({ fullname } = {}) {
    return t
      .expect(this.nodes.title.innerText)
      .eql(fullname, 'Title contains fullname')
      .expect(this.nodes.subTitle.innerText)
      .match(/[A-Z]{3}[0-9]{4}[A-Z]{1}$/, 'Subtitle contains reference number')
  }

  async checkPersonalDetails({
    policeNationalComputer,
    prisonNumber,
    dateOfBirth,
    gender,
    ethnicity,
  } = {}) {
    await this.checkSummaryList(this.nodes.personalDetails, {
      'PNC number': policeNationalComputer,
      'Prison number': prisonNumber,
      'Date of birth': dateOfBirth
        ? `${filters.formatDate(dateOfBirth)} (Age ${filters.calculateAge(
            dateOfBirth
          )})`
        : undefined,
      Gender: gender,
      Ethnicity: ethnicity,
    })
  }

  async checkMoveDetails(move = {}) {
    const { moveType, additionalInformation } = move
    let { toLocation } = move

    if (moveType === 'prison_recall') {
      toLocation = 'Prison recall'
    }

    if (moveType === 'video_remand') {
      toLocation = 'Prison remand (Video Remand Hearing)'
    }

    if (additionalInformation) {
      toLocation += ` — ${additionalInformation}`
    }

    const metaListedItems = moveToMetaListComponent(move).items
    const date = metaListedItems.filter(item => item.key.text === 'Date')[0]
      .value.text
    await this.checkSummaryList(this.nodes.moveDetails, {
      To: toLocation,
      Date: date,
    })
  }

  checkCourtHearings({ hasCourtCase } = {}) {
    if (hasCourtCase === 'No') {
      return t.expect(this.nodes.noCourtHearingsMessage.exists).ok()
    }

    // TODO: Write further assertions for when a move does have a court case
    return t.expect(this.nodes.noCourtHearingsMessage.exists).not.ok()
  }

  checkCourtInformation({
    selectedItems = [],
    solicitor,
    interpreter,
    otherCourt,
  } = {}) {
    if (selectedItems.length === 0) {
      return t.expect(this.nodes.noCourtInformationMessage.exists).ok()
    }

    return this.checkSummaryList(this.nodes.courtInformation, {
      'Solicitor or other legal representation': solicitor,
      'Sign or other language interpreter': interpreter,
      'Any other information': otherCourt,
    })
  }

  checkRiskInformation({
    selectedItems = [],
    violent,
    holdSeparately,
    selfHarm,
    concealedItems,
    otherRisks,
    escape: escapeRisk,
  } = {}) {
    if (selectedItems.length === 0) {
      return t.expect(this.nodes.noRiskInformationMessage.exists).ok()
    }

    return this.checkAssessment(this.nodes.riskInformation, selectedItems, {
      Violent: violent,
      Escape: escapeRisk,
      'Must be held separately': holdSeparately,
      'Self harm': selfHarm,
      'Concealed items': concealedItems,
      'Any other risks': otherRisks,
    })
  }

  checkHealthInformation({
    selectedItems = [],
    specialDietOrAllergy,
    healthIssue,
    medication,
    wheelchair,
    pregnant,
    otherHealth,
    specialVehicleRadio,
    specialVehicle,
  } = {}) {
    // Special case to handle the yes/no explicit field
    if (specialVehicleRadio === 'Yes') {
      selectedItems.push('Requires special vehicle')
    }

    if (selectedItems.length === 0) {
      return t.expect(this.nodes.noHealthInformationMessage.exists).ok()
    }

    return this.checkAssessment(this.nodes.healthInformation, selectedItems, {
      'Special diet or allergy': specialDietOrAllergy,
      'Health issue': healthIssue,
      Medication: medication,
      'Wheelchair user': wheelchair,
      Pregnant: pregnant,
      'Any other requirements': otherHealth,
      'Requires special vehicle': specialVehicle,
    })
  }

  async checkAssessment(selector, selectedItems, labelMap) {
    for (const key of selectedItems) {
      const tag = this.nodes.tags.withText(key.toUpperCase())
      const panel = selector
        .find('.app-tag')
        .withText(key.toUpperCase())
        .parent('.app-panel')
      const comment = labelMap[key]

      // check answer panel exists
      await t.expect(panel.exists).ok()
      // check answer tag exists
      await t.expect(tag.exists).ok()

      // if comment was entered, check it is displayed
      if (comment) {
        const commentPanel = selector.withText(comment)
        await t.expect(commentPanel.exists).ok()
      }
    }
  }

  async checkUpdateLink(category, exists = true) {
    const selector = this.nodes.getUpdateLink(category)
    await t.expect(selector.exists).eql(exists)
  }

  async checkNoUpdateLink(category) {
    await this.checkUpdateLink(category, false)
  }

  async clickUpdateLink(category, exists = true) {
    const selector = this.nodes.getUpdateLink(category)
    await t.click(selector)
  }
}

export default MoveDetailPage
