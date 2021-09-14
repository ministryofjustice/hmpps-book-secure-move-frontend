const { sortBy, findIndex } = require('lodash')

module.exports = function (req, res, next) {
  const {
    assessment,
    frameworkSection: { key: currentSection },
  } = req

  const frameworkSections = sortBy(assessment._framework.sections, ['order'])
  const currentIndex = findIndex(frameworkSections, { key: currentSection })

  if (currentIndex > 0) {
    req.previousFrameworkSection = frameworkSections[currentIndex - 1]
  } else {
    req.previousFrameworkSection = null
  }

  if (currentIndex + 1 < frameworkSections.length) {
    req.nextFrameworkSection = frameworkSections[currentIndex + 1]
  } else {
    req.nextFrameworkSection = null
  }

  next()
}
