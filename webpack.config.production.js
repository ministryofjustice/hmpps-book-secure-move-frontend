const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  output: {
    filename: 'javascripts/[name].[contenthash:8].js',
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].[contenthash:8].css',
    }),
  ],
}
