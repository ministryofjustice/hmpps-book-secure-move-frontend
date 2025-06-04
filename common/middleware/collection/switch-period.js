function switchPeriod(defaults = {}) {
  return function handleSwitchPeriod(req, res) {
    const { view } = req.params
    let currentPeriod = req.session.period
    const groupBy = req.session.group_by

    if (!currentPeriod) {
      currentPeriod = defaults[view]
    }

    const switchedPeriod = currentPeriod === 'day' ? 'week' : 'day'
    req.session.period = switchedPeriod
    const redir = req.originalUrl
      .replace('/switch-view', '')
      .replace(currentPeriod, switchedPeriod)
    res.redirect(groupBy ? `${redir}?group_by=${groupBy}` : `${redir}`)
  }
}

module.exports = switchPeriod
