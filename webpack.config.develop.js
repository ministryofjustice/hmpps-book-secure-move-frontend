const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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

    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css',
      chunkFilename: '[id].css',
    }),
  ],
}
