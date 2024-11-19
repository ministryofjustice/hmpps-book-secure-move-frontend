import { Selector } from 'testcafe'

import { Page } from './page'

class PopulationWeeklyPage extends Page {
  constructor() {
    super()

    this.nodes = {
      breadcrumbs: {
        overview: Selector('.govuk-breadcrumbs__link'),
      } as any,
    }
  }
}

export default PopulationWeeklyPage
