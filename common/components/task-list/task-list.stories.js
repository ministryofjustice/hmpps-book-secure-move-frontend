import macroTemplate from './task-list.stories.njk'

export default {
  title: 'Components / Task List',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    items: [
      {
        text: 'Task one',
        href: '/task-one',
      },
      {
        text: 'Task two',
        href: '/task-two',
      },
      {
        text: 'Task three',
        href: '/task-three',
      },
    ],
  },
}

export const withTags = Template.bind({})
withTags.args = {
  data: {
    items: [
      {
        text: 'Your details',
        href: '/your-details',
        tag: {
          text: 'Not started',
          classes: 'govuk-tag--grey',
        },
      },
      {
        text: 'Read declaration',
        href: '/declaration',
        tag: {
          text: 'Incomplete',
          classes: 'govuk-tag--blue',
        },
      },
      {
        text: 'Company information',
        href: '/company-information',
        tag: {
          text: 'Complete',
        },
      },
    ],
  },
}
