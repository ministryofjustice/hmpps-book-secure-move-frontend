function Message($module) {
  this.cacheEls($module)

  this.defaults = {
    isDismissable: this.$module.hasAttribute('data-allow-dismiss'),
    isFocused: this.$module.hasAttribute('data-focus'),
  }

  this.settings = this.defaults
}

Message.prototype = {
  appendClose: function($element) {
    if (
      $element.className.indexOf('error') !== -1 ||
      !this.settings.isDismissable
    ) {
      return
    }

    const link = document.createElement('a')

    link.innerHTML = 'Dismiss'
    link.className = 'app-message__close'
    link.href = '#'
    link.onclick = e => {
      e.preventDefault()
      this.removeElement($element)
    }

    $element.appendChild(link)
  },

  cacheEls: function($module) {
    this.$module = $module
  },

  init: function() {
    this.render()
  },

  removeElement: function(element) {
    const parent = element.parentNode

    parent.removeChild(element)

    if (parent.children.length === 0) {
      parent.remove()
    }
  },

  render: function() {
    this.appendClose(this.$module)

    if (this.settings.isFocused) {
      this.$module.focus()
    }
  },
}

module.exports = Message
