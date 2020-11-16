import macroTemplate from './message.stories.njk'

export default {
  title: 'Components / Message',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

export const basic = Template.bind({})
basic.args = {
  data: {
    classes: 'app-message--info',
    title: {
      text: 'Notification message',
    },
  },
}

export const success = Template.bind({})
success.args = {
  data: {
    classes: 'app-message--success',
    title: {
      text: 'Success message',
    },
  },
}

export const warning = Template.bind({})
warning.args = {
  data: {
    classes: 'app-message--warning',
    title: {
      text: 'Warning message',
    },
  },
}

export const error = Template.bind({})
error.args = {
  data: {
    classes: 'app-message--error',
    title: {
      text: 'Error message',
    },
  },
}

export const withHTML = Template.bind({})
withHTML.args = {
  data: {
    title: {
      html: 'A message with <a href="#">a link</a>',
    },
  },
}

export const withContent = Template.bind({})
withContent.args = {
  data: {
    title: {
      html: 'A message heading',
    },
    content: {
      html: 'Containing some <strong>extra content</strong>',
    },
  },
}

export const withoutDismiss = Template.bind({})
withoutDismiss.args = {
  data: {
    allowDismiss: false,
    title: {
      html: 'Cannot be dismissed',
    },
    content: {
      html: 'Containing some <strong>extra content</strong>',
    },
  },
}

export const focusedOnLoad = Template.bind({})
withoutDismiss.args = {
  data: {
    focusOnload: true,
    title: {
      html: 'Focused on page load',
    },
    content: {
      html: 'Containing some <strong>extra content</strong>',
    },
  },
}
