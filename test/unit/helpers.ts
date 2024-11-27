/**
 * Require uncached modules
 * @param module
 * @returns {any}
 */
function requireUncached(module: string) {
  delete require.cache[require.resolve(module)]
  return require(module)
}

export {
  requireUncached,
}
