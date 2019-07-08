const dependencies = require('./dependencies')

function _healthcheck (dependencies) {
  const promiseArray = dependencies.map(dependency => {
    return dependency
      .healthcheck()
      .then(status => {
        return { name: dependency.name, status }
      })
      .catch(error => {
        return {
          name: dependency.name,
          status: 'Service unavailable',
          error: error.message,
        }
      })
  })

  return Promise.all(promiseArray)
}

async function checkDependencies (req, res, next) {
  try {
    res.dependencies = await _healthcheck(dependencies)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkDependencies,
}
