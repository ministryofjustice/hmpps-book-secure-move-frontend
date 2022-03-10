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
    const contentfulDate = this.getContnetDate($element)
    const cookieValue = this.getCookie('banner-dismissed')

    if (contentfulDate.toString() === cookieValue.toString()) {
      this.removeElement($element)
    } else {
      this.dismissBanner(this.$module)
    }
  },

  dismissBanner: function ($element) {
    const button = document.getElementById('dismiss-banner-button')

    button.onclick = e => {
      e.preventDefault()
      this.removeElement($element)
      this.setBannerCookie($element)
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
  getContnetDate: function (element) {
    const dateElement = element.getAttribute('data-content-date')
    const date = new Date(dateElement)
    return date
  },
  setBannerCookie: function () {
    const date = this.getContnetDate(this.$module)
    document.cookie = 'banner-dismissed' + '=' + date + ';' + ';path=/'
  },
}

module.exports = Banner
