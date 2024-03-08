import * as contentful from 'contentful'

import {ContentfulEntry, ContentfulFields, ContentfulService} from './contentful'

export class DedicatedContentService extends ContentfulService {
  public constructor() {
    super()

    this.contentType = 'dedicatedContent'
  }

  async fetchEntryBySlugId(slugId: any) {
    const entry = (await this.client.getEntries({
      content_type: this.contentType,
    // @ts-ignore
      'fields.slug[in]': slugId,
    })) as contentful.EntryCollection<ContentfulEntry>

    if (!entry.includes?.Entry?.length) {
      return undefined
    }

    return this.createContent(entry.includes.Entry[0].fields).getPostData()
  }
}
