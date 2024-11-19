import { Selector } from 'testcafe'

import { MoveDetailPage } from './move-detail'

class MoveTimelinePage extends MoveDetailPage {
  constructor() {
    super()

    this.nodes = {
      ...this.nodes,
      timeline: Selector('.app-timeline'),
      timelineItems: Selector('.app-timeline__item'),
    }
  }
}

export default MoveTimelinePage
