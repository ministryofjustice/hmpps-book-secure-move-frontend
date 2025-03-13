import * as contentful from 'contentful'

import { ContentfulFields, ContentfulService } from './contentful'

export class DedicatedContentService extends ContentfulService {
  public constructor() {
    super()

    this.contentType = 'dedicatedContent'
  }

  public getClient() {
    return this.client;
  }

  async fetchEntryBySlugId(slugId: any) {
    const entry = (await this.client.getEntries({
      content_type: this.contentType,
      'fields.slug[in]': slugId,
    })) as contentful.EntryCollection<ContentfulFields>

    if (!entry.items?.length) {
      return undefined
    }

    return this.createContent(entry.items[0].fields).getPostData()
  }
}
