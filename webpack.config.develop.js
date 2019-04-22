const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const { PORT } = require('./config')

module.exports = {
  plugins: [
    new BrowserSyncPlugin({
      script: './start.js',
    }, {
      proxy: `http://localhost:${PORT}`,
      open: false,
      files: [
        '.build/**/*.*',
        'app/**/*.njk',
        'common/**/*.njk',
      ],
    }),
  ],
}
