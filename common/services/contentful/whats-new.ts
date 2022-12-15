import { ContentfulService } from './contentful'

export class WhatsNewService extends ContentfulService {
  public constructor() {
    super()

    this.contentType = 'whatsNew'
  }
}
