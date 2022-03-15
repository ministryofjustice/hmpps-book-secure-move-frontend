function Footer($module) {
  this.cacheEls($module)
}

Footer.prototype = {
  init: function () {
    this.renderFooter(this.$module)
  },

  cacheEls: function ($module) {
    this.$module = $module
  },

  renderFooter: function ($element) {
    $element.getElementsByTagName('li').forEach(element => {
      element.setAttribute(
        'id',
        `footer-link-${element.textContent
          .trim()
          .split(' ')
          .join('-')
          .toLowerCase()}`
      )

      element.onclick = e => {
        if (window.gtag) {
          window.gtag('event', `${element.id}-clicked`, {
            event_category: 'footer-link-clicked',
            event_label: `when the ${element.id} is clicked`,
          })
        }
      }
    })
  },
}

module.exports = Footer
