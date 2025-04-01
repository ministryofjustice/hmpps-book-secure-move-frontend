module.exports = {
  decodeAccessToken(token) {
    if (!token) {
      return {}
    }

    const payload = token.split('.')[1]
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
  },
}
