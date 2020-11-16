import macroTemplate from './raw.stories.njk'

export default {
  title: 'Raw',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    html: '<p class="foo-bar">Hello</p>',
  },
}
