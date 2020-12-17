const { format, isSameDay, parseISO, isDate, isValid } = require('date-fns')

const dateTableDecorator = {
  applyClasses({ cell, focusDate, dateClass, focusedDateClass }) {
    if (!cell.date) {
      return {}
    }

    const cellDateAsDate = isDate(cell.date) ? cell.date : parseISO(cell.date)

    if (!isValid(cellDateAsDate)) {
      return {}
    }

    let classes = cell.classes || ''
    classes = classes.concat(' ', dateClass)

    const focusDateAsDate = isDate(focusDate) ? focusDate : parseISO(focusDate)

    const isFocusedDate = isSameDay(cellDateAsDate, focusDateAsDate)

    if (isFocusedDate) {
      classes = classes.concat(' ', focusedDateClass)
    }

    return {
      ...(classes && { classes: classes.trim() }),
    }
  },

  applyHeading({ cell }) {
    if (!cell.date) {
      return {}
    }

    const cellDateAsDate = isDate(cell.date) ? cell.date : parseISO(cell.date)

    if (!isValid(cellDateAsDate)) {
      return {}
    }

    const heading = format(cellDateAsDate, 'E dd')
    return {
      ...(cell.html && { html: heading }),
      ...(cell.text && { text: heading }),
    }
  },

  decorateAsDateTable({ focusDate, tableComponent }) {
    return {
      ...tableComponent,
      head: tableComponent.head.map(column => {
        return {
          ...column,
          ...dateTableDecorator.applyHeading({ cell: column }),
          ...dateTableDecorator.applyClasses({
            cell: column,
            focusDate,
            dateClass: 'date-table__tr--day',
            focusedDateClass: 'date-table__tr--focus',
          }),
        }
      }),
      rows: tableComponent.rows.map(row => {
        return row.map(column => {
          return {
            ...column,
            ...dateTableDecorator.applyClasses({
              cell: column,
              focusDate,
              dateClass: 'date-table__td--day',
              focusedDateClass: 'date-table__td--focus',
            }),
          }
        })
      }),
    }
  },
}

module.exports = dateTableDecorator
