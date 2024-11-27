import { Selector, t } from 'testcafe'

import { Page } from './page'

class PopulationDashboardPage extends Page {
  constructor() {
    super()

    this.nodes = {
      dataCell: {
        freeSpaces: {
          add: Selector('td[data-cell-type="freeSpaces"]').withExactText(
            'Add numbers'
          ),
          edit: Selector('td[data-cell-type="freeSpaces"]').withText('spaces'),
        },
        transfersIn: {
          transfers: Selector('td[data-cell-type="transfersIn"]').withText(
            'transfers in'
          ),
          none: Selector('td[data-cell-type="transfersIn"]').withExactText(
            'None booked'
          ),
        },
        transfersOut: {
          transfers: Selector('td[data-cell-type="transfersOut"]').withText(
            'transfers out'
          ),
          none: Selector('td[data-cell-type="transfersOut"]').withExactText(
            'None booked'
          ),
        },
      } as any,

      changeNumbersLink: Selector('a').withExactText('Change numbers'),
      cancelLink: Selector('a').withExactText('Cancel'),

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
      } as any,
    }
  }

  async visitAddOrEditPage() {
    let freeSpaceCell

    const addNumbersDays = await (this.nodes.dataCell as any).freeSpaces.add

    if (await addNumbersDays.exists) {
      const pos = Math.floor(Math.random() * (await addNumbersDays.count))
      freeSpaceCell = addNumbersDays.nth(pos)
    } else {
      const editNumbersDays = await (this.nodes.dataCell as any).freeSpaces.edit

      if (await editNumbersDays.exists) {
        const pos = Math.floor(Math.random() * (await editNumbersDays.count))
        freeSpaceCell = editNumbersDays.nth(pos)
      }
    }

    await t.expect(freeSpaceCell.exists).ok()

    let href = await freeSpaceCell.find('a').getAttribute('href')

    if (!href.endsWith('edit')) {
      href = `${href}/edit`
    }

    await t.navigateTo(href)
  }
}

export default PopulationDashboardPage
