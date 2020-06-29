function setFramework(framework) {
  return (req, res, next) => {
    req.framework = framework
    next()
  }
}

module.exports = {
  setFramework,
}
