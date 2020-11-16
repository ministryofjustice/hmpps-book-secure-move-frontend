import { addDecorator } from '@storybook/html'
import { withA11y } from '@storybook/addon-a11y'
import { withKnobs } from '@storybook/addon-knobs'

import '../common/assets/scss/application.scss'

addDecorator(withKnobs)
addDecorator(withA11y)
