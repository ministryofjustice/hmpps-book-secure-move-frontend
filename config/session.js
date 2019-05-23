const session = require('express-session')

const { SESSION_SECRET, IS_PRODUCTION } = require('./')

module.exports = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: IS_PRODUCTION },
})
