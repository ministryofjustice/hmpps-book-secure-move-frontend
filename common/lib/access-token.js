module.exports = {
  // This function will not created a valid token, it is just for tests
  encodeAccessToken(token) {
    if (!token) {
      return ''
    }

    return '.' + Buffer.from(JSON.stringify(token), 'utf8').toString('base64')
  },
  decodeAccessToken(token) {
    if (!token) {
      return {}
    }

    const payload = token.split('.')[1]
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
  },
}
