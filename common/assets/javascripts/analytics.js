const { nodeListForEach } = require('./utils')
function Analytics($module) {
  this.cacheEls($module)
}

Analytics.prototype = {
  cacheEls: function() {
    this.$errors = document.querySelectorAll('.govuk-error-summary__list li a')
  },

  init: function() {
    this.cacheEls()
    this.render()
  },

  render: function() {
    nodeListForEach(this.$errors, this.trackError.bind(this))
  },

  sendEvent: function({ action, category, label }) {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
      })
    }
  },

  trackError: function(error) {
    const fieldId = error.href.substring(error.href.indexOf('#') + 1)
    const errorMessage = error.text

    this.sendEvent({
      action: fieldId,
      category: 'validation_error',
      label: errorMessage,
    })
  },
}

module.exports = Analytics
