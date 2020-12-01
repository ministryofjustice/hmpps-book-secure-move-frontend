const { get } = require('lodash')

module.exports = function mapQuestionToResponse({ questions = {} } = {}) {
  return response => {
    const question = questions[get(response, 'question.key')]

    return {
      ...response,
      _question: question,
    }
  }
}
