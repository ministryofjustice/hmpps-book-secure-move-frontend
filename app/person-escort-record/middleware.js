function setFramework(framework) {
  return (req, res, next) => {
    req.framework = framework
    next()
  }
}

function setFrameworkSection(frameworkSection) {
  return (req, res, next) => {
    req.frameworkSection = frameworkSection
    next()
  }
}

module.exports = {
  setFramework,
  setFrameworkSection,
}
