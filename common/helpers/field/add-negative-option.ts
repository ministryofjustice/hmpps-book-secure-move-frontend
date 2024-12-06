export default function addNegativeOption(originalFields: Record<string, any>, fieldName: string, negativeOptionText: string, requiredMessage: string) {
  const fields = { ...originalFields }

  if (fields[fieldName]) {
    const { items } = fields[fieldName]
    fields[fieldName].items = [
      ...items,
      {
        divider: 'or',
      },
      {
        value: 'none',
        text: negativeOptionText,
        behaviour: 'exclusive',
      },
    ]
    fields[fieldName].validate = [
      {
        type: 'required',
        message: requiredMessage,
      }
    ]
  }

  return fields
}