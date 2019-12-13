/**
 * Require uncached modules
 * @param module
 * @returns {any}
 */
function requireUncached(module) {
  delete require.cache[require.resolve(module)]
  return require(module)
}

module.exports = {
  requireUncached,
}
