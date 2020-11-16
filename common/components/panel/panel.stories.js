import macroTemplate from './panel.stories.njk'

export default {
  title: 'Components / Panel',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    text: 'Lorem Ipsum',
  },
}

export const withTag = Template.bind({})
withTag.args = {
  data: {
    text: 'Panel contents',
    tag: {
      text: 'An example tag',
    },
  },
}
