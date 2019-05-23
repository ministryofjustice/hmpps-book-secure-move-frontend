const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  output: {
    filename: 'javascripts/[name].[contenthash:8].js',
  },

  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash:8].[ext]',
          },
        }],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].[contenthash:8].css',
    }),
  ],
}
