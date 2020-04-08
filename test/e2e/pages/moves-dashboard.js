import { Selector } from 'testcafe'

import Page from './page'

class MovesDashboardPage extends Page {
  constructor() {
    super()

    this.nodes = {
      moves: Selector('.app-card'),
      movesLinks: Selector('.app-card .app-card__link'),
      downloadMovesLink: Selector('a').withText('Download moves'),
      createMoveButton: Selector('.govuk-button').withExactText(
        'Create a move'
      ),
      filterContainer: Selector('.app-filter'),
      pagination: {
        previousLink: Selector('.app-pagination__list-item--prev a'),
        todayLink: Selector('.app-pagination__list-item a').withText('Today'),
        thisWeekLink: Selector('.app-pagination__list-item a').withText(
          'This week'
        ),
        nextLink: Selector('.app-pagination__list-item--next a'),
      },
    }
  }
}

export default MovesDashboardPage
