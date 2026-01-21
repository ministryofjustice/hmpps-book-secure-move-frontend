function switchPeriod(defaults = {}) {
  return function handleSwitchPeriod(req, res) {
    const { view } = req.params
    let currentPeriod = req.session.period

    if (!currentPeriod) {
      currentPeriod = defaults[view]
    }

    const switchedPeriod = currentPeriod === 'day' ? 'week' : 'day'
    req.session.period = switchedPeriod
    const redir = req.headers.referer
      .replace('/switch-view', '')
      .replace(`/${currentPeriod}/`, `/${switchedPeriod}/`)
    res.redirect(`${redir}`)
  }
}

module.exports = switchPeriod
