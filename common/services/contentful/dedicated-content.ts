import * as contentful from 'contentful'

import { ContentfulEntry, ContentfulFields, ContentfulService } from './contentful'
import { entries } from 'lodash'

export class DedicatedContentService extends ContentfulService {
  public constructor() {
    super()

    this.contentType = 'dedicatedContent'
  }

  public getClient() {
    return this.client;
  }

  // async fetchEntryBySlugId(slugId: any) {
  //   const entry = (await this.client.getEntries({
  //     content_type: this.contentType,
  //     'fields.slug[in]': slugId,
  //   })) as contentful.EntryCollection<ContentfulFields>
  //
  //   if (!entry.items?.length) {
  //     return undefined
  //   }
  //
  //   return this.createContent(entry.items[0].fields).getPostData()
  // }

  async fetchEntryBySlugId(slugId: any) {
    const entries = (await this.client.getEntries({
      content_type: this.contentType,
      // 'fields.slug[in]': slugId,
    })) as contentful.EntryCollection<ContentfulEntry>

    return entries.includes?.Entry?.filter(e => e.fields.id === slugId)?.filter(e => this.createContent(e).getPostData())
  }
}
