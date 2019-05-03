const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const { PORT } = require('./config')

module.exports = {
  plugins: [
    new BrowserSyncPlugin({
      proxy: `http://localhost:${PORT}`,
      port: '3001',
      open: false,
      files: [
        '.build/**/*.*',
        'app/**/*.njk',
        'common/**/*.njk',
      ],
    }),
  ],
}
