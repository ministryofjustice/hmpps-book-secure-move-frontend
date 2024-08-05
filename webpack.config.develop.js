const BrowserSyncPlugin = require('browser-sync-v3-webpack-plugin')

const { PORT } = require('./config')

module.exports = {
  devtool: 'source-map',

  plugins: [
    new BrowserSyncPlugin({
      proxy: `http://localhost:${PORT}`,
      port: '3001',
      open: false,
      files: ['.build/**/*.*', 'app/**/*.njk', 'common/**/*.njk'],
    }),
  ],
}
