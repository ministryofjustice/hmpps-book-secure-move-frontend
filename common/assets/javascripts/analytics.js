const { nodeListForEach } = require('./utils')

function Analytics($module) {
  this.cacheEls($module)
}

Analytics.prototype = {
  init: function () {
    this.cacheEls()
    this.render()
  },

  cacheEls: function () {
    this.$errors = document.querySelectorAll('.govuk-error-summary__list li a')
  },

  render: function () {
    nodeListForEach(this.$errors, this.trackError.bind(this))
  },

  trackError: function (error) {
    const fieldId = error.href.substring(error.href.indexOf('#') + 1)
    const errorMessage = error.text

    this.sendEvent({
      action: fieldId,
      category: 'validation_error',
      label: errorMessage,
    })
  },

  sendEvent: function ({ action, category, label }) {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      })
    }
  },
}

module.exports = Analytics
