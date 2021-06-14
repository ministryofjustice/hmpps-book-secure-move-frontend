const faker = require('faker')

function generateAssessmentRespones(responses) {
  return responses.map(response => {
    const options = response.question.options
    let value

    if (response.value_type === 'string') {
      if (options.length > 0) {
        value = options.includes('No')
          ? 'No'
          : faker.random.arrayElement(options)
      } else {
        value = faker.lorem.sentence()
      }
    }

    if (response.value_type === 'array') {
      value = [faker.random.arrayElement(options)]
    }

    if (response.value_type === 'object::followup_comment') {
      value = {
        option: faker.random.arrayElement(options),
        details: faker.lorem.sentence(),
      }
    }

    if (response.value_type === 'collection::followup_comment') {
      value = options.map(option => {
        return {
          option,
          details: faker.lorem.sentence(),
        }
      })
    }

    return {
      value,
      id: response.id,
    }
  })
}

module.exports = {
  generateAssessmentRespones,
}
