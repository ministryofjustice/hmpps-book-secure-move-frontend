const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { PORT } = require('./config')

module.exports = {
  devtool: 'source-map',

  plugins: [
    new BrowserSyncPlugin({
      files: ['.build/**/*.*', 'app/**/*.njk', 'common/**/*.njk'],
      open: false,
      port: '3001',
      proxy: `http://localhost:${PORT}`,
    }),

    new MiniCssExtractPlugin({
      chunkFilename: '[id].css',
      filename: 'stylesheets/[name].css',
    }),
  ],
}
