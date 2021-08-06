const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const tablePresenters = require('./table')

function peopleToSearchResultsTable() {
  return function (people = []) {
    const tableConfig = [
      {
        head: {
          html: 'name',
        },
        row: {
          html: data => `<a href="/person/${data.id}">${data._fullname}</a>`,
          attributes: {
            scope: 'row',
          },
        },
      },
      {
        head: {
          html: 'fields::police_national_computer.label',
          attributes: {
            width: '160',
          },
        },
        row: {
          text: 'police_national_computer',
        },
      },
      {
        head: {
          html: 'fields::prison_number.label',
          attributes: {
            width: '160',
          },
        },
        row: {
          text: 'prison_number',
        },
      },
      {
        head: {
          text: 'fields::date_of_birth.label',
          attributes: {
            width: '200',
          },
        },
        row: {
          text: data => {
            const dateOfBirthLabel = i18n.t('age', {
              context: 'with_date_of_birth',
              age: filters.calculateAge(data.date_of_birth),
              date_of_birth: filters.formatDate(data.date_of_birth),
            })
            return dateOfBirthLabel
          },
        },
      },
      {
        head: {
          text: 'fields::gender.label',
          attributes: {
            width: '150',
          },
        },
        row: {
          text: 'gender.title',
        },
      },
    ]

    return {
      head: tableConfig.map(tablePresenters.objectToTableHead()),
      rows: people.map(tablePresenters.objectToTableRow(tableConfig)),
    }
  }
}

module.exports = peopleToSearchResultsTable
