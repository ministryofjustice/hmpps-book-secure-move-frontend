function Banner($module) {
  this.cacheEls($module)

  this.defaults = {
    isDismissable: this.$module.hasAttribute('data-allow-dismiss'),
    isFocused: this.$module.hasAttribute('data-focus'),
  }

  this.settings = this.defaults
}

Banner.prototype = {
  init: function () {
    this.render()
  },

  cacheEls: function ($module) {
    this.$module = $module
  },

  render: function () {
    this.dismissBanner(this.$module)

    if (this.settings.isFocused) {
      this.$module.focus()
    }
  },

  dismissBanner: function ($element) {
    const button = document.getElementById('dismiss-banner-button')

    button.onclick = e => {
      e.preventDefault()
      this.removeElement($element)
      this.setBannerCookie()
    }
  },

  removeElement: function (element) {
    if (element.style.display === 'none') {
      element.style.display = 'block'
    } else {
      element.style.display = 'none'
    }
  },
}

module.exports = Banner
