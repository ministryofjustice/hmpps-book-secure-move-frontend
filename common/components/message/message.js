function Message($module) {
  this.cacheEls($module)

  this.defaults = {
    isDismissable: this.$module.hasAttribute('data-allow-dismiss'),
    isFocused: this.$module.hasAttribute('data-focus'),
  }

  this.settings = this.defaults
}

Message.prototype = {
  init: function() {
    this.render()
  },

  cacheEls: function($module) {
    this.$module = $module
  },

  render: function() {
    this.appendClose(this.$module)

    if (this.settings.isFocused) {
      this.$module.focus()
    }
  },

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

  removeElement: function(element) {
    const parent = element.parentNode

    parent.removeChild(element)

    if (parent.children.length === 0) {
      parent.remove()
    }
  },
}

module.exports = Message
