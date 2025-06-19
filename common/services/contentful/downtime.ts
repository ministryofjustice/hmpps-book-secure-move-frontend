import { Entry } from 'contentful'
import * as contentful from 'contentful'

// @ts-ignore
import { get, set } from '../../../common/lib/api-client/cache'
import i18n from '../../../config/i18n'
import { sentenceFormatDate, sentenceFormatTime } from '../../formatters'

import {
  ContentfulContent,
  ContentfulFields,
  ContentfulService,
} from './contentful'

const getDateAndTime = (date: Date) => {
  if (!date) {
    return null
  }

  return {
    date: sentenceFormatDate(date).replace(',', ''),
    time: sentenceFormatTime(date),
  }
}

interface DowntimeFields extends ContentfulFields {
  start: string
  end: string
  daysNotice: number
  briefBannerText: string
}

export interface DowntimeContentfulEntry {
  fields: DowntimeFields
  contentTypeId: string
}

// Exported for testing
export class DowntimeContent extends ContentfulContent {
  private start: Date
  private end: Date
  private daysNotice: number

  constructor(data: {
    start: Date
    end: Date
    daysNotice: number
    bannerText: string
  }) {
    const date = new Date(data.start)
    date.setDate(date.getDate() - data.daysNotice)

    const formattedDates = {
      start: getDateAndTime(data.start),
      end: getDateAndTime(data.end),
    }

    super({
      title: '',
      body: i18n.t('downtime::page_text', formattedDates),
      bannerText: i18n
        .t('downtime::banner_text', { message: data.bannerText })
        .split('\n')
        .join('<br/>'),
      date,
      expiry: data.end,
    })

    this.start = data.start
    this.end = data.end
    this.daysNotice = data.daysNotice
  }

  isActive() {
    return Date.now() >= this.start.getTime() && Date.now() < this.end.getTime()
  }
}

export class DowntimeService extends ContentfulService {
  public constructor() {
    super()

    this.contentType = 'downtime'
  }

  toDowntimeContent(
    entries: contentful.EntryCollection<DowntimeContentfulEntry>
  ): DowntimeContent[] {
    const downtimeContentfulEntries: DowntimeContentfulEntry[] =
      entries.items.map(item => {
        return this.createContentfulEntry(item)
      })

    const downtimeContents = downtimeContentfulEntries
      .map(e => this.createContent(e))
      .sort((a, b) => {
        return b.date.getTime() - a.date.getTime()
      })

    return downtimeContents
  }

  protected createContent(entry: DowntimeContentfulEntry): DowntimeContent {
    const a = new DowntimeContent({
      start: new Date(entry.fields.start),
      end: new Date(entry.fields.end),
      daysNotice: entry.fields.daysNotice,
      bannerText: entry.fields.briefBannerText,
    })
    return a
  }

  protected createContentfulEntry(entry: Entry) {
    const contentfulEntry: DowntimeContentfulEntry = {
      fields: {
        start: entry.fields.start,
        end: entry.fields.end,
        daysNotice: entry.fields.daysNotice,
        briefBannerText: entry.fields.briefBannerText,
      } as DowntimeFields,
      contentTypeId: entry.sys.contentType.sys.id,
    }
    return contentfulEntry
  }

  protected createFromCache(c: any) {
    return new DowntimeContent({
      start: new Date(c.start),
      end: new Date(c.end),
      daysNotice: c.daysNotice,
      bannerText: c.bannerText,
    })
  }

  async fetchPosts(entries?: DowntimeContent[]) {
    if (!entries) {
      entries = (await this.fetchEntries()) as DowntimeContent[]
    }

    return entries.filter(c => c.isActive()).map(entry => entry.getPostData())
  }

  async fetchBanner(entries?: DowntimeContent[]) {
    if (!Array.isArray(entries)) {
      entries = entries !== undefined ? [entries] : []
    }

    if (entries.length === 0) {
      entries = await this.fetchEntries()
    }

    return entries
      .filter(
        entry => typeof entry.isCurrent === 'function' && entry.isCurrent()
      )[0]
      ?.getBannerData()
  }

  async fetchEntries(): Promise<DowntimeContent[]> {
    const cachedEntries = await get(`cache:entries:${this.contentType}`, true)

    if (cachedEntries) {
      const cached = [...cachedEntries]
      return cached.map(e => this.createFromCache(e))
    }

    const entries = (await this.client.getEntries({
      content_type: this.contentType,
    })) as contentful.EntryCollection<DowntimeContentfulEntry>

    if (entries.items.length === 0) {
      return []
    }

    const entriesToCache = this.toDowntimeContent(entries)

    await set(`cache:entries:${this.contentType}`, entriesToCache, 300, true)

    return entriesToCache
  }
}
