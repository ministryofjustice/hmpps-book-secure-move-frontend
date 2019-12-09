import 'core-js/es/promise'

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
import '../images/tick-icon.png'
import '../images/tick-icon@2x.png'

const { nodeListForEach } = require('./utils')
const { initAll } = require('govuk-frontend')
const accessibleAutocomplete = require('accessible-autocomplete')
const StickySidebar = require('sticky-sidebar/dist/sticky-sidebar')
const Message = require('../../components/message/message')
const Header = require('../../components/internal-header/internal-header')
const MultiFileUpload = require('../../components/multi-file-upload/multi-file-upload')
const Analytics = require('./analytics')

initAll()

new Analytics().init()

const $toggleButton = document.querySelector('[data-module="header"]')
new Header($toggleButton).init()

const $messages = document.querySelectorAll('[data-module="app-message"]')
nodeListForEach($messages, function($message) {
  new Message($message).init()
})

const $autocompletes = document.querySelectorAll(
  '[data-module="app-autocomplete"]'
)
nodeListForEach($autocompletes, function($autocomplete) {
  accessibleAutocomplete.enhanceSelectElement({
    selectElement: $autocomplete,
    showAllValues: true,
    defaultValue: '',
  })
})

const $stickySidebars = document.querySelectorAll('.sticky-sidebar')
if ($stickySidebars.length) {
  // eslint-disable-next-line no-new
  new StickySidebar('.sticky-sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '.sticky-sidebar-container',
    innerWrapperSelector: '.sticky-sidebar__inner',
  })
}

const $multiFileUpload = document.querySelector(
  '[data-module="app-multi-file-upload"]'
)

if ($multiFileUpload) {
  new MultiFileUpload({
    container: $multiFileUpload,
  }).init()
}
