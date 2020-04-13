const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const merge = require('webpack-merge')

const { IS_DEV, IS_PRODUCTION } = require('./config')
const configPaths = require('./config/paths')

const commonConfig = {
  entry: {
    app: './common/assets/javascripts/application.js',
    styles: './common/assets/scss/application.scss',
    'styles-ie8': './common/assets/scss/application-ie8.scss',
  },

  mode: IS_DEV ? 'development' : 'production',

  module: {
    rules: [
      {
        exclude: /@babel(?:\/|\\{1,2})runtime|core-js|css-loader/, // IE 10 issues with core-js 3 details here: https://github.com/zloirock/core-js/issues/514#issuecomment-523524472
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          compact: false,
          plugins: ['syntax-dynamic-import'],
          presets: [
            [
              '@babel/preset-env',
              {
                corejs: 3,
                modules: false,
                useBuiltIns: 'entry',
              },
            ],
          ],
        },
        test: /\.js$/,
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: IS_DEV,
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, 'node_modules'),
                  configPaths.components,
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
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
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
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

  output: {
    filename: 'javascripts/[name].js',
    path: configPaths.build,
    publicPath: '/',
  },

  plugins: [new WebpackAssetsManifest()],
}

const webpackEnvironment = IS_PRODUCTION ? 'production' : 'develop'
const environmentConfig = require(`./webpack.config.${webpackEnvironment}`)
const webpackConfig = merge.smart(commonConfig, environmentConfig)

module.exports = webpackConfig
