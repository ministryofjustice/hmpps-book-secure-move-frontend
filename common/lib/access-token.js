module.exports = {
  decodeAccessToken(token) {
    const payload = token.split('.')[1]
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
  },
}
