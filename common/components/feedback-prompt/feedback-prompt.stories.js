import macroTemplate from './feedback-prompt.stories.njk'

export default {
  title: 'Feedback Prompt',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    content: {
      html:
        'This is a new feature — <a href="#">give us your feedback</a> to help us improve it',
    },
  },
}
