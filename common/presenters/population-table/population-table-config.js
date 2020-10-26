const { addDays, format, isSameDay } = require('date-fns')

const locationMetaToSpacesLink = require('./location-meta-to-spaces-link')

const populationTableDay = {
  establishmentConfig({ isSortable = false }) {
    return {
      head: {
        isSortable,
        sortKey: 'title',
        html: 'Establishment',
        attributes: {
          width: '220',
        },
      },
      row: {
        attributes: {
          scope: 'row',
        },
        html: data => {
          return `<a>${data.title}</a>`
        },
      },
    }
  },

  dayConfig({ focusDate, baseDate, baseOffset = 0 }) {
    const dateWithOffset = addDays(baseDate, baseOffset)

    return {
      head: populationTableDay.dayHeadConfig({
        date: dateWithOffset,
        focusDate,
      }),
      row: populationTableDay.dayRowConfig({
        date: dateWithOffset,
        focusDate,
        populationIndex: baseOffset,
      }),
    }
  },

  dayHeadConfig({ date, focusDate }) {
    return {
      text: format(date, 'EEE dd'),
      attributes: {
        width: '80',
      },
      classes: isSameDay(focusDate, date)
        ? 'focus-table__tr--day focus-table__tr--focus'
        : 'focus-table__tr--day',
    }
  },

  dayRowConfig({ date, focusDate, populationIndex = 0 }) {
    const spacesHrefPrefix = '/'

    return {
      html: data => {
        return locationMetaToSpacesLink({
          hrefPrefix: spacesHrefPrefix,
          id: data.meta.populations[populationIndex].id,
          space: data.meta.populations[populationIndex].free_spaces,
        })
      },
      classes: isSameDay(focusDate, date)
        ? 'focus-table__td--day focus-table__td--focus'
        : 'focus-table__td--day',
    }
  },
}

module.exports = populationTableDay
