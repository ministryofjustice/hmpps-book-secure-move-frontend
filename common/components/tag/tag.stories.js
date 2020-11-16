import macroTemplate from './tag.stories.njk'

export default {
  title: 'Tag',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    text: 'alpha',
  },
}

export const inactive = Template.bind({})
inactive.args = {
  data: {
    text: 'inactive',
    classes: 'govuk-tag--inactive',
  },
}

export const withLink = Template.bind({})
withLink.args = {
  data: {
    text: 'alpha',
    href: '/a-link',
  },
}
