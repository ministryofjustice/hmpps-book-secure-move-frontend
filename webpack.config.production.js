const ImageminPlugin = require('imagemin-webpack-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: 'javascripts/[name].[contenthash:8].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].[contenthash:8].css',
    }),
    new ImageminPlugin({
      test: 'images/**',
    }),
  ],
}
