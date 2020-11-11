function Header($module) {
  this.$module = $module
}

Header.prototype.init = function () {
  // Check for module
  const $module = this.$module

  if (!$module) {
    return
  }

  // Check for button
  const $toggleButton = $module.querySelector('.js-header-toggle')

  if (!$toggleButton) {
    return
  }

  // Handle $toggleButton click events
  $toggleButton.addEventListener('click', this.handleClick.bind(this))
}

/**
 * Toggle class
 * @param {object} node element
 * @param {string} className to toggle
 */
Header.prototype.toggleClass = function (node, className) {
  if (node.className.indexOf(className) > 0) {
    node.className = node.className.replace(' ' + className, '')
  } else {
    node.className += ' ' + className
  }
}

/**
 * An event handler for click event on $toggleButton
 * @param {object} event event
 */
Header.prototype.handleClick = function (event) {
  const $module = this.$module
  const $toggleButton = event.target || event.srcElement
  const $target = $module.querySelector(
    '#' + $toggleButton.getAttribute('aria-controls')
  )

  // If a button with aria-controls, handle click
  if ($toggleButton && $target) {
    this.toggleClass($target, 'app-header__navigation--open')
    this.toggleClass($toggleButton, 'app-header__menu-button--open')

    $toggleButton.setAttribute(
      'aria-expanded',
      $toggleButton.getAttribute('aria-expanded') !== 'true'
    )
    $target.setAttribute(
      'aria-hidden',
      $target.getAttribute('aria-hidden') === 'false'
    )
  }
}

module.exports = Header
