import '../images/app-logotype-crest.png'
import '../images/app-logotype-crest@2x.png'
import '../images/favicon.ico'
import '../images/hmpps-apple-touch-icon.png'
import '../images/hmpps-apple-touch-icon-152x152.png'
import '../images/hmpps-apple-touch-icon-167x167.png'
import '../images/hmpps-apple-touch-icon-180x180.png'

import { nodeListForEach } from './utils'
import { initAll } from 'govuk-frontend'
import Message from '../../components/message/message'

initAll()

var $messages = document.querySelectorAll('[data-module="app-message"]')
nodeListForEach($messages, function ($message) {
  new Message($message).init()
})
