import 'core-js/es/promise'
import 'dropzone'

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
import '../images/person-fallback.png'
import '../images/person-fallback@2x.png'

const accessibleAutocomplete = require('accessible-autocomplete')
const { initAll } = require('govuk-frontend')
const StickySidebar = require('sticky-sidebar/dist/sticky-sidebar')

const Header = require('../../components/internal-header/internal-header')
const Message = require('../../components/message/message')
const MultiFileUpload = require('../../components/multi-file-upload/multi-file-upload')

const Analytics = require('./analytics')
const { nodeListForEach } = require('./utils')

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

const $multiFileUploads = document.querySelectorAll(
  '[data-module="app-multi-file-upload"]'
)
nodeListForEach($multiFileUploads, function($multiFileUpload) {
  new MultiFileUpload($multiFileUpload).init()
})
