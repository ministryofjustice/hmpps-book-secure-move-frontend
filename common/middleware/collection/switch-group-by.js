function switchGroupBy(defaults = {}) {
  return function handleSwitchGroupBy(req, res) {
    const { view } = req.params

    let currentGroupBy = req.session.group_by

    if (!currentGroupBy) {
      currentGroupBy = defaults[view]
    }

    const switchedGroupBy =
      currentGroupBy === 'location' ? 'vehicle' : 'location'
    req.session.group_by = switchedGroupBy
    const redir = req.originalUrl
      .replace('/switch-group-by', '')
      .replace(`?group_by=${currentGroupBy}`, '')

    res.redirect(`${redir}?group_by=${switchedGroupBy}`)
  }
}

module.exports = switchGroupBy
