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
import '../images/person-fallback.png'
import '../images/person-fallback@2x.png'

import MultiFileUpload from '../../components/multi-file-upload/multi-file-upload'

const accessibleAutocomplete = require('accessible-autocomplete')
const { initAll } = require('govuk-frontend')
const HcSticky = require('hc-sticky')
const StickySidebar = require('sticky-sidebar/dist/sticky-sidebar')
// const stickybits = require('stickybits/dist/stickybits')

const AddAnother = require('../../components/add-another/add-another')
const Header = require('../../components/internal-header/internal-header')
const Message = require('../../components/message/message')
const Time = require('../../components/time/time')

const Analytics = require('./analytics')
const { nodeListForEach } = require('./utils')

initAll()

// eslint-disable-next-line no-new
new AddAnother('.moj-add-another')

new Analytics().init()

const $times = document.querySelectorAll('[data-module="app-time"]')
nodeListForEach($times, function ($module) {
  new Time($module).init()
})

const $toggleButton = document.querySelector('[data-module="header"]')
new Header($toggleButton).init()

const $messages = document.querySelectorAll('[data-module="app-message"]')
nodeListForEach($messages, function ($message) {
  new Message($message).init()
})

const $autocompletes = document.querySelectorAll(
  '[data-module="app-autocomplete"]'
)
nodeListForEach($autocompletes, function ($autocomplete) {
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

// stickybits('.stickybits', {
//   useStickyClasses: true,
// })

const elements = document.querySelectorAll('.sticky-header')

for (let i = 0; i < elements.length; i++) {
  // eslint-disable-next-line no-new
  new HcSticky(elements[i], {
    // stickTo: '#main-wrapper',
    stickTo: elements[i].parentNode,
    // top: 20,
    // bottomEnd: 30,
  })
}

// const $stickybits = document.querySelectorAll('.hs-sticky')

// if ($stickybits.length) {
//   // eslint-disable-next-line no-new
//   const Sticky = new HcSticky('.hs-sticky', {
//     stickTo: 'body',
//   })
// }

const $multiFileUploads = document.querySelectorAll(
  '[data-module="app-multi-file-upload"]'
)
nodeListForEach($multiFileUploads, function ($multiFileUpload) {
  new MultiFileUpload($multiFileUpload).init()
})
