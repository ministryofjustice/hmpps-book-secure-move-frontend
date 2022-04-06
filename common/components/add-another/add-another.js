const MOJFrontend = require('@ministryofjustice/frontend/moj/all')
const { initAll } = require('govuk-frontend')

const _onAddButtonClick = MOJFrontend.AddAnother.prototype.onAddButtonClick
const _onRemoveButtonClick =
  MOJFrontend.AddAnother.prototype.onRemoveButtonClick

MOJFrontend.AddAnother.prototype.onAddButtonClick = function (e) {
  _onAddButtonClick.apply(this, [e])
  initAll()
}

MOJFrontend.AddAnother.prototype.onRemoveButtonClick = function (e) {
  $('.govuk-error-summary').remove()
  _onRemoveButtonClick.apply(this, [e])
}

MOJFrontend.AddAnother.prototype.updateAttributes = function (index, item) {
  item.find('[data-name]').each(function (i, el) {
    const originalId = el.id

    const $el = $(el)
    el.name = $el.attr('data-name').replace(/%index%/, index)
    el.id = $el.attr('data-id').replace(/%index%/, index)

    // Book a secure move changes to this method from here
    const label =
      $el.siblings('label')[0] ||
      $el.parents('label')[0] ||
      item.find('[for="' + originalId + '"]')[0]

    if (label) {
      label.htmlFor = el.id
    }

    // ensure conditionally revealed inputs correctly targetted
    const ariaControls = $el.attr('aria-controls')

    if (ariaControls) {
      const $ariaControlled = $el.parent().next()

      if ($ariaControlled.attr('id') === ariaControls) {
        const correctConditionalId = 'conditional-' + el.id
        $el.attr('aria-controls', correctConditionalId)
        $ariaControlled.attr('id', correctConditionalId)
      }
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
    const $el = $(el)
    const attr = $el.attr('aria-describedby').replace(/\b.*-error\b/, '')
    $el.attr('aria-describedby', attr)
  })
}

module.exports = MOJFrontend.AddAnother
