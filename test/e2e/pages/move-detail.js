import { forEach } from 'lodash'
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
      personalDetailsSummary: Selector(
        '#main-content .govuk-grid-column-two-thirds dl.govuk-summary-list'
      ),
      courtInformationHeading: Selector('#main-content h2').withText(
        'Information for the court'
      ),
      courtInformation: Selector('#main-content h2')
        .withText('Information for the court')
        .sibling('dl'),
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
    police_national_computer: pncNumber,
    prison_number: prisonNumber,
    date_of_birth: dateOfBirth,
    gender,
    ethnicity,
  } = {}) {
    const labelMap = {
      'PNC number': pncNumber,
      'Prison number': prisonNumber,
      'Date of birth': dateOfBirth
        ? `${filters.formatDate(dateOfBirth)} (Age ${filters.calculateAge(
            dateOfBirth
          )})`
        : undefined,
      Gender: gender,
      Ethnicity: ethnicity,
    }

    forEach(labelMap, async (value, key) => {
      if (value) {
        await t
          .expect(
            this.getDlDefinitionByKey(this.nodes.personalDetailsSummary, key)
          )
          .eql(value)
      }
    })
  }
}

export default MoveDetailPage
