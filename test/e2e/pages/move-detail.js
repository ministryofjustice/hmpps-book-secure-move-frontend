import { Selector, t } from 'testcafe'

import Page from './page'

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

  checkPersonalDetails({ text, gender, ethnicity } = {}) {
    return t
      .expect(
        this.getDlDefinitionByKey(
          this.nodes.personalDetailsSummary,
          'PNC number'
        )
      )
      .eql(text.police_national_computer)
      .expect(
        this.getDlDefinitionByKey(this.nodes.personalDetailsSummary, 'Gender')
      )
      .eql(gender)
      .expect(
        this.getDlDefinitionByKey(
          this.nodes.personalDetailsSummary,
          'Ethnicity'
        )
      )
      .eql(ethnicity)
  }
}

export default MoveDetailPage
