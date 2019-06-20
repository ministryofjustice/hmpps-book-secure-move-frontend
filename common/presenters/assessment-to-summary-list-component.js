function _mapAnswer ({ title, comments }) {
  return {
    key: {
      text: title,
    },
    value: {
      text: comments,
    },
  }
}

function _filterAnswer (category) {
  return function (answer) {
    if (!category) {
      return true
    }
    return answer.category === category
  }
}

module.exports = function assessmentToSummaryListComponent (answers, filterCategory) {
  const rows = answers
    .filter(_filterAnswer(filterCategory))
    .map(_mapAnswer)

  return {
    rows,
  }
}
