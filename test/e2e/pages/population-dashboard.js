import { Selector, t } from 'testcafe'

import Page from './page'

class PopulationDashboardPage extends Page {
  constructor() {
    super()

    this.nodes = {
      focusDay: Selector('td').filter('.date-table__td--focus'),
      focusDayLink: Selector('td').filter('.date-table__td--focus').find('a'),
      days: Selector('td').filter('.date-table__td--day'),
      establishment: Selector('[data-cell-type="establishment"]'),
      establishmentLink: Selector('[data-cell-type="establishment"]').find('a'),
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
    const focusDays = await this.nodes.focusDay.count
    let dayCell

    if (focusDays > 0) {
      // There is a population entry today
      dayCell = this.nodes.focusDay
    } else {
      // It's the weekend, or there is no entry
      dayCell = this.nodes.days
    }

    let href = await dayCell.find('a').getAttribute('href')

    if (!href.endsWith('edit')) {
      href = `${href}/edit`
    }

    await t.navigateTo(href)
  }
}

export default PopulationDashboardPage
