import macroTemplate from './framework-response.stories.njk'

export default {
  title: 'Components / Framework Response',
  component: macroTemplate,
}

const Template = data => `${macroTemplate(data)}`

// export const withNoParams = Template.bind({})

export const stringValue = Template.bind({})
stringValue.args = {
  data: {
    value: 'Example string response',
    valueType: 'string',
    responded: true,
  },
}

export const objectValue = Template.bind({})
objectValue.args = {
  data: {
    value: {
      option: 'Yes',
    },
    valueType: 'object::followup_comment',
    responded: true,
  },
}

export const objectTypeWithDetails = Template.bind({})
objectTypeWithDetails.args = {
  data: {
    value: {
      option: 'Yes',
      details: 'Example further details for this response',
    },
    valueType: 'object::followup_comment',
    responded: true,
  },
}

export const arrayType = Template.bind({})
arrayType.args = {
  data: {
    value: ['Item one', 'Item two', 'Item three'],
    valueType: 'array',
    responded: true,
  },
}

export const collectionType = Template.bind({})
collectionType.args = {
  data: {
    value: [
      { option: 'Item one' },
      { option: 'Item two' },
      { option: 'Item three' },
    ],
    valueType: 'collection::followup_comment',
    responded: true,
  },
}

export const collectionWithDetails = Template.bind({})
collectionWithDetails.args = {
  data: {
    value: [
      {
        option: 'Item one',
        details: 'Further details for option one',
      },
      {
        option: 'Item two',
        details: 'Further details for option two',
      },
      {
        option: 'Item three',
        details: 'Further details for option three',
      },
    ],
    valueType: 'collection::followup_comment',
    responded: true,
  },
}

export const additionalHTML = Template.bind({})
additionalHTML.args = {
  data: {
    value: 'Example string response',
    valueType: 'string',
    responded: true,
    afterContent: {
      html: 'Some example <strong>HTML</strong>',
    },
  },
}

export const unanswered = Template.bind({})
unanswered.args = {
  data: {
    responded: false,
    questionUrl: '/step-url#question-id',
  },
}

export const prefilled = Template.bind({})
prefilled.args = {
  data: {
    value: 'Example string response',
    valueType: 'string',
    responded: false,
    prefilled: true,
    questionUrl: '/step-url#question-id',
  },
}

export const emptyAnswer = Template.bind({})
emptyAnswer.args = {
  data: {
    responded: true,
    questionUrl: '/step-url#question-id',
  },
}
