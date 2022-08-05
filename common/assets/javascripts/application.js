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

const DevelopmentTools = require('../../../app/home/development-tools')
const AddAnother = require('../../components/add-another/add-another')
const Footer = require('../../components/footer/footer')
const Header = require('../../components/internal-header/internal-header')
const Message = require('../../components/message/message')
const Time = require('../../components/time/time')
const Banner = require('../../components/whats-new-banner/whats-new-banner')

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

const $banner = document.querySelectorAll(
  '[data-module="app-whats-new-banner"]'
)
nodeListForEach($banner, function ($banner) {
  new Banner($banner).init()
})

const $toggleBanner = document.querySelectorAll(
  '[data-module="app-toggle-banner"]'
)
nodeListForEach($toggleBanner, function ($toggleBanner) {
  new DevelopmentTools($toggleBanner, document).init()
})

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

const elements = document.querySelectorAll('.sticky')

for (let i = 0; i < elements.length; i++) {
  const element = elements[i]
  // eslint-disable-next-line no-undef
  const computedStyle = getComputedStyle(element)
  const verticalPadding =
    parseFloat(computedStyle.paddingTop) +
    parseFloat(computedStyle.paddingBottom)
  const elementHeight = element.offsetHeight - verticalPadding

  // eslint-disable-next-line no-new
  new HcSticky(elements[i], {
    stickyClass: 'is-sticky',
    innerTop: elementHeight,
  })
}

const $multiFileUploads = document.querySelectorAll(
  '[data-module="app-multi-file-upload"]'
)
nodeListForEach($multiFileUploads, function ($multiFileUpload) {
  new MultiFileUpload($multiFileUpload).init()
})

const $footer = document.querySelectorAll('footer')
nodeListForEach($footer, function ($module) {
  new Footer($module).init()
})
