import * as contentful from 'contentful'

import { ContentfulEntry, ContentfulService } from './contentful'

export class DedicatedContentService extends ContentfulService {
  public constructor() {
    super()

    this.contentType = 'dedicatedContent'
  }

  public getClient() {
    return this.client;
  }

  async fetchEntryBySlugId(slugId: any) {
    // TODO need to work out how to query by field as this returns all then filters
    const entries = await this.client.getEntries({
      content_type: this.contentType,
    }) as contentful.EntryCollection<ContentfulEntry>

    const entry: ContentfulEntry[] = entries.items.filter(item => item.fields.slug === slugId).map(
      item => this.createContentfulEntry(item)
    )
    return this.createContent(entry[0]).getPostData()
  }
}
