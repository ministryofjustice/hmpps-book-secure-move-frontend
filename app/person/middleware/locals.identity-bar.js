module.exports = (req, res, next) => {
  const { _fullname: name } = req.person || {}

  res.locals.identityBar = {
    classes: 'sticky',
    caption: {
      text: req.t('person::page_caption'),
    },
    heading: {
      html: req.t('person::page_heading', { name }),
    },
  }

  next()
}
