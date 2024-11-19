import { Selector, t } from 'testcafe'

import * as filters from '../../../config/nunjucks/filters'

import { Page } from './page'

import { moveDetailPage } from './index'

export class MoveDetailPage extends Page {
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
      extraditionDetails: Selector('#main-content h2')
        .withText('Extradition details')
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
      addLodgeButton: Selector('.app-identity-bar__inner')
        .find('.govuk-button')
        .withText('Add overnight lodge'),
      addAnotherLodgeButton: Selector('.app-identity-bar__inner')
        .find('.govuk-button')
        .withText('Add another overnight lodge'),
      cancelLodgingLink: Selector('.govuk-list')
        .find('.app-link--destructive')
        .withText('Cancel overnight lodge'),
      detailsTab: Selector('#tab-details'),
      lodgesSection: Selector('.govuk-grid-column-two-thirds').find(
        'section:nth-child(3)'
      ),
    }

    this.nodes.lodgesTitle = (this.nodes.lodgesSection as Selector).find('h2')
    this.nodes.lodgesCards = (this.nodes.lodgesSection as Selector).find(
      '.govuk-summary-card'
    )
  }

  checkHeader({ fullname }: { fullname: string }) {
    return t
      .expect((this.nodes.title as Selector).innerText)
      .contains(fullname, 'Title contains fullname')
      .expect((this.nodes.title as Selector).innerText)
      .match(/[A-Z]{3}[0-9]{4}[A-Z]/, 'Subtitle contains reference number')
  }

  async checkPersonalDetails({
    policeNationalComputer,
    prisonNumber,
  }: {
    policeNationalComputer: string
    prisonNumber: string
  }) {
    await this.checkSummaryList(this.nodes.personalDetails as Selector, {
      'PNC number': policeNationalComputer,
      'Prison number': prisonNumber,
    })
  }

  async checkMoveDetails(move: {
    date: string
    moveType: string
    additionalInformation: string
    toLocation: string
  }) {
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

    const formattedDate = filters.formatDateWithRelativeDay(date) as string
    await this.checkSummaryList(this.nodes.moveDetails as Selector, {
      To: toLocation,
      Date: formattedDate,
    })
  }

  checkCourtHearings({ hasCourtCase }: { hasCourtCase: 'Yes' | 'No' }) {
    if (hasCourtCase === 'No') {
      return t
        .expect((this.nodes.noCourtInformationMessage as Selector).exists)
        .ok()
    }

    // TODO: Write further assertions for when a move does have a court case
    return t
      .expect((this.nodes.noCourtInformationMessage as Selector).exists)
      .notOk()
  }

  async checkExtraditionDetails(extraditionDetails: {
    flightTime: string
    flightNumber: string
    flightDay: string
    flightMonth: string
    flightYear: string
  }) {
    await t.expect((this.nodes.extraditionDetails as Selector).exists).ok()
    const expectedDate = filters.formatDateWithRelativeDay(
      new Date(
        Number(extraditionDetails.flightYear),
        Number(extraditionDetails.flightMonth) - 1,
        Number(extraditionDetails.flightDay)
      )
    ) as string
    const expectedTime = filters.formatTime(
      extraditionDetails.flightTime
    ) as string
    return this.checkSummaryList(this.nodes.extraditionDetails as Selector, {
      'Flight number': extraditionDetails.flightNumber,
      'Flight date': expectedDate,
      'Flight time': expectedTime,
    })
  }

  checkCourtInformation({
    selectedItems = [],
    solicitor,
    interpreter,
    otherCourt,
  }: {
    selectedItems: string[]
    solicitor: string
    interpreter: string
    otherCourt: string
  }) {
    if (selectedItems.length === 0) {
      return t
        .expect((this.nodes.noCourtInformationMessage as Selector).exists)
        .ok()
    }

    return this.checkSummaryList(this.nodes.courtInformation as Selector, {
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
  }: {
    selectedItems: string[]
    violent: string
    holdSeparately: string
    selfHarm: string
    concealedItems: string
    otherRisks: string
    escape: string
  }) {
    if (selectedItems.length === 0) {
      return t
        .expect((this.nodes.noRiskInformationMessage as Selector).exists)
        .ok()
    }

    return this.checkSummaryList(this.nodes.riskInformation as Selector, {
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
  }: {
    selectedItems: string[]
    specialDietOrAllergy: string
    healthIssue: string
    medication: string
    wheelchair: string
    pregnant: string
    otherHealth: string
    specialVehicleRadio: string
    specialVehicle: string
  }) {
    // Special case to handle the yes/no explicit field
    if (specialVehicleRadio === 'Yes') {
      selectedItems.push('Requires special vehicle')
    }

    if (selectedItems.length === 0) {
      return t
        .expect((this.nodes.noHealthInformationMessage as Selector).exists)
        .ok()
    }

    return this.checkSummaryList(this.nodes.healthInformation as Selector, {
      'Special diet or allergy': specialDietOrAllergy,
      'Health issue': healthIssue,
      Medication: medication,
      'Wheelchair user': wheelchair,
      Pregnant: pregnant,
      'Any other requirements': otherHealth,
      'Requires special vehicle': specialVehicle,
    })
  }

  async checkUpdateLink(category: string, exists = true) {
    const selector = (this.nodes.getUpdateLink as Function)(category)
    await t.expect(selector.exists).eql(exists)
  }

  async checkCancelLink(exists = true) {
    const selector = (this.nodes.getCancelLink as Function)()
    await t.expect(selector.exists).eql(exists)
  }

  async checkNoUpdateLink(category: string) {
    await this.checkUpdateLink(category, false)
  }

  async clickUpdateLink(category: string) {
    const selector = (this.nodes.getUpdateLink as Function)(category)
    await t.click(selector)
  }

  async clickCancelLodgingsLink() {
    await t.click(this.nodes.cancelLodgingLink as Selector)
  }

  getLodgingCard(index: number) {
    return (moveDetailPage.nodes.lodgesCards as Selector).nth(index)
  }

  getLodgingLocationValue(index: number) {
    return this.getLodgingCard(index).find(
      '.govuk-summary-list__row:nth-child(1) > .govuk-summary-list__value'
    )
  }

  getLodgingDateValue(index: number) {
    return this.getLodgingCard(index).find(
      '.govuk-summary-list__row:nth-child(2) > .govuk-summary-list__value'
    )
  }

  async clickUpdateLodgingLocationLink(index: number) {
    await t.click(this.getLodgingLocationValue(index).find('a'))
  }

  async clickUpdateLodgingDateLink(index: number) {
    await t.click(this.getLodgingDateValue(index).find('a'))
  }

  async checkLodgesInDetails(lodgeCount: number) {
    await t.click(moveDetailPage.nodes.detailsTab as Selector)

    if (lodgeCount) {
      await t
        .expect((moveDetailPage.nodes.lodgesTitle as Selector).innerText)
        .eql('Overnight lodge details')
      await t
        .expect((moveDetailPage.nodes.lodgesCards as Selector).count)
        .eql(lodgeCount)
      return
    }

    await t
      .expect((moveDetailPage.nodes.lodgesTitle as Selector).innerText)
      .notEql('Overnight lodge details')
  }
}
