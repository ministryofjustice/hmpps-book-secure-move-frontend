const path = require('path')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { IS_DEV, IS_PRODUCTION, BUILD_DIRECTORY } = require('./config')

const commonConfig = {
  entry: {
    styles: './common/assets/scss/application.scss',
    'styles-ie8': './common/assets/scss/application-ie8.scss',
    app: './common/assets/javascripts/application.js',
  },

  output: {
    path: BUILD_DIRECTORY,
    filename: 'javascripts/[name].js',
    publicPath: '/',
  },

  mode: IS_DEV ? 'development' : 'production',

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css',
      chunkFilename: '[id].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: ['syntax-dynamic-import'],

          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
              },
            ],
          ],
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: IS_DEV,
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, 'node_modules'),
              ],
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [new UglifyJsPlugin()],
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: true,
    },
  },
}

const webpackEnvironment = IS_PRODUCTION ? 'production' : 'develop'
const environmentConfig = require(`./webpack.config.${webpackEnvironment}`)
const webpackConfig = merge.smart(commonConfig, environmentConfig)

module.exports = webpackConfig
