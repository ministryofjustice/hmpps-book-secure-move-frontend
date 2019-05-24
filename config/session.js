const session = require('express-session')

const { SESSION_SECRET, IS_PRODUCTION } = require('./')

module.exports = session({
  name: 'pecs-id',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: IS_PRODUCTION,
    maxAge: 1800000, // 30 mins
  },
})
