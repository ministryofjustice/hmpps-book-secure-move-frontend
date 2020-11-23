const { addDays, format, isSameDay } = require('date-fns')

const i18n = require('../../../config/i18n')

const populationTableDay = {
  establishmentConfig({ isSortable = false }) {
    return {
      head: {
        isSortable,
        sortKey: 'title',
        html: 'population::labels.establishment',
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
    return {
      html: data => {
        const { id } = data
        const { free_spaces: count } =
          data?.meta?.populations?.[populationIndex] || {}

        const link =
          count === undefined
            ? i18n.t('population::add_space')
            : i18n.t('population::spaces_with_count', { count })

        const editQuicklink = count === undefined ? '/edit' : ''

        const url = `/population/day/${format(
          date,
          'yyyy-MM-dd'
        )}/${id}${editQuicklink}`

        return `<a href="${url}">${link}</a>`
      },
      classes: isSameDay(focusDate, date)
        ? 'focus-table__td--day focus-table__td--focus'
        : 'focus-table__td--day',
    }
  },
}

module.exports = populationTableDay
