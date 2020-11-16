import macroTemplate from './data.stories.njk'

export default {
  title: 'Components / Data',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    label: 'emails sent',
  },
}

export const inverted = Template.bind({})
inverted.args = {
  data: {
    label: 'Moving to',
    value: 'Rochester',
    inverted: true,
  },
}

export const extraLargeVariation = Template.bind({})
extraLargeVariation.args = {
  data: {
    classes: 'app-data--xl',
    label: 'emails sent',
    value: 25,
  },
}

export const withHeadingAsElement = Template.bind({})
withHeadingAsElement.args = {
  data: {
    element: 'h2',
    inverted: true,
    label: 'Moving to',
    value: 'Rochester',
  },
}
