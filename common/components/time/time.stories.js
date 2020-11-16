import macroTemplate from './time.stories.njk'

export default {
  title: 'Components / Time',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    datetime: '2019-01-10',
  },
}

export const withCustomText = Template.bind({})
withCustomText.args = {
  data: {
    datetime: '2019-01-10',
    text: 'Today',
  },
}
