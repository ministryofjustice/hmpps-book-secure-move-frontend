const MOJFrontend = require('@ministryofjustice/frontend/moj/all')
const { initAll } = require('govuk-frontend')

const _onAddButtonClick = MOJFrontend.AddAnother.prototype.onAddButtonClick

MOJFrontend.AddAnother.prototype.onAddButtonClick = function (e) {
  _onAddButtonClick.apply(this, [e])
  initAll()
}

MOJFrontend.AddAnother.prototype.updateAttributes = function (index, item) {
  item.find('[data-name]').each(function (i, el) {
    var $el = $(el)
    el.name = $el.attr('data-name').replace(/%index%/, index)
    el.id = $el.attr('data-id').replace(/%index%/, index)

    // Book a secyre move changes to this method from here
    var label = $el.siblings('label')[0] || $el.parents('label')[0]

    if (label) {
      label.htmlFor = el.id
    }
  })

  this.updateContent(index, item)
  this.removeError(item)
}

MOJFrontend.AddAnother.prototype.updateContent = function (index, item) {
  item.find('[data-content="index"]').each(function (i, el) {
    $(el).html(index + 1)
  })
}

MOJFrontend.AddAnother.prototype.removeError = function (item) {
  item.find('.govuk-error-message').remove()
  item.find('.govuk-form-group--error').removeClass('govuk-form-group--error')
  item.find('.govuk-input--error').removeClass('govuk-input--error')
  item.find('[aria-describedby]').each(function (index, el) {
    var $el = $(el)
    var attr = $el.attr('aria-describedby').replace(/\b.*-error\b/, '')
    $el.attr('aria-describedby', attr)
  })
}

module.exports = MOJFrontend.AddAnother
