function Banner($module) {
  this.cacheEls($module)
}

Banner.prototype = {
  init: function () {
    this.renderBanner(this.$module)
  },

  cacheEls: function ($module) {
    this.$module = $module
  },

  renderBanner: function ($element) {
    const contentfulDate = this.getContentDate($element)
    const cookieValue = this.getCookie('banner-dismissed')

    if (contentfulDate.toString() === cookieValue.toString()) {
      this.removeElement($element)
    } else {
      this.dismissBanner(this.$module)
      this.linkToWhatsNewPageClicked()
    }
  },

  dismissBanner: function ($element) {
    const button = document.getElementById('dismiss-banner-button')

    button.onclick = e => {
      e.preventDefault()
      this.removeElement($element)
      this.setBannerCookie($element)
      this.sendEvent(
        'dismiss-whats-new-banner',
        'banner-dismissed',
        'When a user has clicked the dismiss banner button'
      )
    }
  },

  linkToWhatsNewPageClicked: function () {
    const link = document.getElementById('whats-new-page-link')

    link.onclick = e => {
      this.sendEvent(
        'whats-new-banner-call-to-action-link-clicked',
        'banner-call-to-action-clicked',
        'When a user has clicked on the read more about these changes banner link'
      )
    }
  },

  removeElement: function (element) {
    if (element.style.display === 'none') {
      element.style.display = 'block'
    } else {
      element.style.display = 'none'
    }
  },
  getCookie: function (cookieName) {
    const name = cookieName + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookie = decodedCookie.split(';')

    for (let i = 0; i < cookie.length; i++) {
      let c = cookie[i]

      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }

      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }

    return ''
  },
  getContentDate: function (element) {
    const dateElement = element.getAttribute('data-content-date')
    return new Date(dateElement)
  },
  setBannerCookie: function () {
    const date = this.getContentDate(this.$module)
    document.cookie = 'banner-dismissed' + '=' + date + ';' + ';path=/'
  },
  sendEvent: function (eventName, eventCategory, eventLabel) {
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
      })
    }
  },
}

module.exports = Banner
