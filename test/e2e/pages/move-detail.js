import { Selector, t } from 'testcafe'

import * as filters from '../../../config/nunjucks/filters'

import Page from './page'

class MoveDetailPage extends Page {
  constructor() {
    super()

    this.nodes = {
      ...this.nodes,
      title: Selector('#main-content .app-identity-bar__heading'),
      subTitle: Selector('#main-content .app-identity-bar__summary'),
      cancelLink: Selector('.app-link--destructive').withText(
        'Cancel this move'
      ),
      tagList: Selector('[data-tag-list-source]'),
      tags: Selector('[data-tag-list-source] a.app-tag'),
      personalDetails: Selector('#main-content h3')
        .withText('Personal details')
        .sibling('dl'),
      moveDetails: Selector('#main-content h3')
        .withText('Move details')
        .sibling('dl'),
      courtInformationHeading: Selector('#main-content h2').withText(
        'Information for the court'
      ),
      courtInformation: Selector('#main-content h2')
        .withText('Information for the court')
        .sibling('dl'),
      noCourtInformationMessage: Selector('.app-message').withText(
        'No information for the court'
      ),
      riskInformation: Selector('#main-content h2')
        .withText('Risk information')
        .sibling('dl'),
      noRiskInformationMessage: Selector('.app-message').withText(
        'No risk information'
      ),
      healthInformation: Selector('#main-content h2')
        .withText('Health information')
        .sibling('dl'),
      noHealthInformationMessage: Selector('.app-message').withText(
        'No health information'
      ),
      identityBar: Selector('.app-identity-bar__inner'),
      personEscortRecordSectionStatuses: Selector(
        '#main-content .app-task-list__item .govuk-tag'
      ),
      personEscortRecordSectionLinks: Selector(
        '#main-content .app-task-list__item a'
      ),
      personEscortRecordWarnings: Selector('#main-content strong.app-tag'),
      personEscortRecordStartButton: Selector('.app-identity-bar__inner')
        .find('.govuk-button')
        .withText('Start Person Escort Record'),
      personEscortRecordViewButton: Selector('.app-identity-bar__inner')
        .find('.govuk-button')
        .withText('View Person Escort Record'),
      personEscortRecordConfirmationButton: Selector('.app-identity-bar__inner')
        .find('.govuk-button')
        .withText('Record handover'),
      getCancelLink: Selector('.app-link--destructive'),
      getUpdateLink: category => {
        return Selector(`[data-update-link="${category}"]`)
      },
    }
  }

  checkHeader({ fullname } = {}) {
    return t
      .expect(this.nodes.title.innerText)
      .contains(fullname, 'Title contains fullname')
      .expect(this.nodes.title.innerText)
      .match(/[A-Z]{3}[0-9]{4}[A-Z]{1}/, 'Subtitle contains reference number')
  }

  async checkPersonalDetails({ policeNationalComputer, prisonNumber } = {}) {
    await this.checkSummaryList(this.nodes.personalDetails, {
      'PNC number': policeNationalComputer,
      'Prison number': prisonNumber,
    })
  }

  async checkMoveDetails(move = {}) {
    const { date, moveType, additionalInformation } = move
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

    const formattedDate = filters.formatDateWithRelativeDay(date)
    await this.checkSummaryList(this.nodes.moveDetails, {
      To: toLocation,
      Date: formattedDate,
    })
  }

  checkCourtHearings({ hasCourtCase } = {}) {
    if (hasCourtCase === 'No') {
      return t.expect(this.nodes.noCourtInformationMessage.exists).ok()
    }

    // TODO: Write further assertions for when a move does have a court case
    return t.expect(this.nodes.noCourtInformationMessage.exists).not.ok()
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

    return this.checkSummaryList(this.nodes.riskInformation, {
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

    return this.checkSummaryList(this.nodes.healthInformation, {
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
      const panel = selector
        .find('.app-tag')
        .withText(key.toUpperCase())
        .parent('.app-panel')
      const comment = labelMap[key]

      // check answer panel exists
      await t.expect(panel.exists).ok()

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

  async checkNoCancelLink() {
    await this.checkCancelLink(false)
  }

  async checkCancelLink(exists = true) {
    const selector = this.nodes.getCancelLink()
    await t.expect(selector.exists).eql(exists)
  }

  async checkNoUpdateLink(category) {
    await this.checkUpdateLink(category, false)
  }

  async clickUpdateLink(category) {
    const selector = this.nodes.getUpdateLink(category)
    await t.click(selector)
  }
}

export default MoveDetailPage
