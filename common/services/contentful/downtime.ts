import i18n from '../../../config/i18n'
import { sentenceFormatDate, sentenceFormatTime } from '../../formatters'

import {
  ContentfulContent,
  ContentfulFields,
  ContentfulService
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
}

// Exported for testing
export class DowntimeContent extends ContentfulContent {
  private start: Date
  private end: Date

  constructor(data: { start: Date; end: Date; daysNotice: number }) {
    const date = new Date(data.start)
    date.setDate(date.getDate() - data.daysNotice)

    const formattedDates = {
      start: getDateAndTime(data.start),
      end: getDateAndTime(data.end),
    }

    super({
      title: '',
      body: i18n.t('downtime::page_text', formattedDates),
      bannerText: i18n.t('downtime::banner_text', formattedDates),
      date,
      expiry: data.end,
    })

    this.start = data.start
    this.end = data.end
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

  protected createContent(fields: DowntimeFields): ContentfulContent {
    return new DowntimeContent({
      start: new Date(fields.start),
      end: new Date(fields.end),
      daysNotice: fields.daysNotice,
    })
  }

  async fetchPosts(entries?: DowntimeContent[]) {
    if (!entries) {
      entries = (await this.fetchEntries()) as DowntimeContent[]
    }

    return entries.filter(c => c.isActive()).map(entry => entry.getPostData())
  }
}
