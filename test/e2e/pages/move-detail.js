import { Selector, t } from 'testcafe'

import Page from './page'
import filters from '../../../config/nunjucks/filters'

class MoveDetailPage extends Page {
  constructor() {
    super()

    this.nodes = {
      title: Selector('#main-content > header > h1'),
      subTitle: Selector('#main-content > header > span'),
      banner: Selector('.app-message--info'),
      bannerHeading: Selector('.app-message--info .app-message__heading'),
      bannerContent: Selector('.app-message--info .app-message__content'),
      cancelLink: Selector('.app-link--destructive').withText(
        'Cancel this move'
      ),
      tags: Selector('header a.app-tag'),
      personalDetails: Selector('#main-content h2')
        .withText('Personal details')
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
        .sibling('.app-panel'),
      noRiskInformationMessage: Selector('.app-message').withText(
        'No risk information'
      ),
      healthInformation: Selector('#main-content h2')
        .withText('Health affecting transport')
        .sibling('.app-panel'),
      noHealthInformationMessage: Selector('.app-message').withText(
        'No health affecting transport'
      ),
    }
  }

  checkHeader({ fullname } = {}) {
    return t
      .expect(this.nodes.title.innerText)
      .eql(fullname, 'Title contains fullname')
      .expect(this.nodes.subTitle.innerText)
      .match(/[A-Z]{3}[0-9]{4}[A-Z]{1}$/, 'Subtitle contains reference number')
  }

  checkBanner({ heading, content } = {}) {
    return t
      .expect(this.nodes.bannerHeading.innerText)
      .contains(heading, 'Banner contains text')
      .expect(this.nodes.bannerContent.innerText)
      .contains(content, 'Content contains text')
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

  async checkSummaryList(selector, labelMap) {
    for (const [key, value] of Object.entries(labelMap)) {
      if (value) {
        await t.expect(this.getDlDefinitionByKey(selector, key)).eql(value)
      }
    }
  }

  async checkAssessment(selector, selectedItems, labelMap) {
    for (const key of selectedItems) {
      const tag = this.nodes.tags.withText(key.toUpperCase())
      const panel = selector.withText(key.toUpperCase())
      const comment = labelMap[key]

      // check answer panel exists
      await t.expect(panel.exists).ok()
      // check answer tag exists
      await t.expect(tag.exists).ok()

      // if comment was entered, check it is displayed
      if (comment) {
        await t.expect(panel.innerText).contains(comment)
      }
    }
  }
}

export default MoveDetailPage
