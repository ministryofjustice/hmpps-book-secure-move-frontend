import macroTemplate from './read-only-field.stories.njk'

export default {
  title: 'Components / Read Only Field',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const withNoParams = Template.bind({})

export const withText = Template.bind({})
withText.args = {
  data: {
    label: 'Lorem Ipsum',
  },
}

export const withPrevNext = Template.bind({})
withPrevNext.args = {
  data: {
    previous: 'Previous Page',
    next: 'Next page',
  },
}
