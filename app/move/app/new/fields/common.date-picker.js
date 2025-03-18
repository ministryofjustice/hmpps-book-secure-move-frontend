const { date: dateFormatter } = require('../../../../../common/formatters')

const date = {
  validate: ['date'],
  formatter: [dateFormatter],
  component: 'raw',
  html: `
    <div class="moj-datepicker" data-module="moj-date-picker">

    <div class="govuk-form-group">
      <label class="govuk-label" for="date">
        Date
      </label>

      <div id="date-hint" class="govuk-hint">
        For example, 17/5/2024.
      </div>

      <input class="govuk-input moj-js-datepicker-input" id="date_picker" name="date_picker" type="text" aria-describedby="date-hint" autocomplete="off">

    </div>

  </div>`,
  hint: {
    text: 'fields::date.hint',
  },
}

module.exports = date
