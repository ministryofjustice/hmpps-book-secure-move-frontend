const { differenceInMinutes, isPast, parseISO } = require('date-fns')
const timeago = require('timeago.js')

function Time($module) {
  this.cacheEls($module)

  this.defaults = {
    hasTag: this.$module.hasAttribute('data-has-tag'),
    isRelative: this.$module.hasAttribute('data-display-relative'),
    imminentOffset: parseInt(this.$module.getAttribute('data-imminent-offset')),
    datetime: this.$module.getAttribute('datetime'),
  }

  this.settings = this.defaults
}

Time.prototype = {
  init: function () {
    if (this.settings.hasTag) {
      this.bindEvents()
    }

    this.render()
  },

  cacheEls: function ($module) {
    this.$module = $module
  },

  bindEvents() {
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(this.onChangeHandler.bind(this))

    // Start observing the target node for configured mutations
    observer.observe(this.$module, {
      attributes: false,
      childList: true,
      subtree: false,
    })
  },

  onChangeHandler(mutationsList, observer) {
    for (let index = 0; index < mutationsList.length; index++) {
      const mutation = mutationsList[index]

      if (mutation.type === 'childList') {
        const parsedDate = parseISO(this.settings.datetime)
        const overdue = isPast(parsedDate)
        const imminent =
          differenceInMinutes(parsedDate, new Date()) <
          this.settings.imminentOffset

        if (overdue) {
          this.$module.closest('.govuk-tag').className =
            'govuk-tag govuk-tag--red'
        } else if (imminent) {
          this.$module.closest('.govuk-tag').className =
            'govuk-tag govuk-tag--yellow'
        } else {
          this.$module.closest('.govuk-tag').className =
            'govuk-tag govuk-tag--green'
        }
      }
    }
  },

  render: function () {
    if (this.settings.isRelative) {
      timeago.render(this.$module)
    }
  },
}

module.exports = Time
