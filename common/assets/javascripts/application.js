import '../images/app-logotype-crest.png'
import '../images/app-logotype-crest@2x.png'

import { nodeListForEach } from './utils'
import { initAll } from 'govuk-frontend'
import Message from '../../components/message/message'

initAll()

var $messages = document.querySelectorAll('[data-module="app-message"]')
nodeListForEach($messages, function ($message) {
  new Message($message).init()
})
