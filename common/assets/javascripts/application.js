import '../images/app-logotype-crest.png'
import '../images/app-logotype-crest@2x.png'
import '../images/favicon.ico'
import '../images/hmpps-apple-touch-icon.png'
import '../images/hmpps-apple-touch-icon-152x152.png'
import '../images/hmpps-apple-touch-icon-167x167.png'
import '../images/hmpps-apple-touch-icon-180x180.png'
import '../images/print-icon.png'
import '../images/print-icon@2x.png'
import '../images/download-icon.png'
import '../images/download-icon@2x.png'

import { nodeListForEach } from './utils'
import { initAll } from 'govuk-frontend'
import accessibleAutocomplete from 'accessible-autocomplete'
import StickySidebar from 'sticky-sidebar/dist/sticky-sidebar'
import Message from '../../components/message/message'
import Header from '../../components/internal-header/internal-header'
import Analytics from './analytics'

initAll()

new Analytics().init()

var $toggleButton = document.querySelector('[data-module="header"]')
new Header($toggleButton).init()

var $messages = document.querySelectorAll('[data-module="app-message"]')
nodeListForEach($messages, function($message) {
  new Message($message).init()
})

var $autocompletes = document.querySelectorAll(
  '[data-module="app-autocomplete"]'
)
nodeListForEach($autocompletes, function($autocomplete) {
  accessibleAutocomplete.enhanceSelectElement({
    selectElement: $autocomplete,
    showAllValues: true,
    defaultValue: '',
  })
})

var $stickySidebars = document.querySelectorAll('.sticky-sidebar')
if ($stickySidebars.length) {
  // eslint-disable-next-line no-new
  new StickySidebar('.sticky-sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.sticky-sidebar-container',
    innerWrapperSelector: '.sticky-sidebar__inner',
  })
}
