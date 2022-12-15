import { ContentfulService } from './contentful'

export class DedicatedContentService extends ContentfulService {
  public constructor() {
    super()

    this.contentType = 'dedicatedContent'
  }
}
