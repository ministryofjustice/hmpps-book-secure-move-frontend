import { Selector, t } from 'testcafe'

import Page from './page'

class PopulationDashboardPage extends Page {
  constructor() {
    super()

    this.nodes = {
      focusDay: Selector('td').filter('.date-table__td--focus'),
      focusDayLink: Selector('td').filter('.date-table__td--focus').find('a'),
      days: Selector('td').filter('.date-table__td--day'),
      establishment: Selector('td').filter('date-table__td--establishment'),
      pagination: {
        previousLink: Selector('.app-pagination__list-item--prev a'),
        thisWeekLink: Selector('.app-pagination__list-item a').withText(
          'This week'
        ),
        nextLink: Selector('.app-pagination__list-item--next a'),
      },
    }
  }

  async visitEditPage() {
    let dayCell

    if (this.nodes.focusDay.exists) {
      // There is a population entry today
      dayCell = this.nodes.focusDay
    } else {
      // It's the weekend, or there is no entry
      dayCell = this.nodes.days
    }

    const link = await dayCell.find('a')
    let href = await link.getAttribute('href')

    if (!href.endsWith('edit')) {
      href = `${href}/edit`
    }

    await t.navigateTo(href)
  }
}

export default PopulationDashboardPage
