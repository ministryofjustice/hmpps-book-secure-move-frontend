const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const YAML = require('js-yaml')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const { merge } = require('webpack-merge')

const frameworksService = require('./common/services/frameworks')
const { IS_DEV, IS_PRODUCTION } = require('./config')
const configPaths = require('./config/paths')

function transformManifestFile(transformMethod) {
  return (content, absolutePath) => {
    const yaml = YAML.load(content)
    const basename = path.basename(absolutePath, '.yml')
    const transformed = transformMethod(basename, yaml)

    return JSON.stringify(transformed, null, 2)
  }
}

const commonConfig = {
  entry: {
    styles: './common/assets/scss/application.scss',
    app: './common/assets/javascripts/application.js',
    'components.maps': './common/assets/javascripts/components.maps.js',
  },

  output: {
    path: configPaths.build,
    filename: `javascripts/[name]${IS_PRODUCTION ? '.[contenthash:8]' : ''}.js`,
    publicPath: '/',
  },

  mode: IS_DEV ? 'development' : 'production',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /@babel(?:\/|\\{1,2})runtime|core-js|css-loader/, // IE 10 issues with core-js 3 details here: https://github.com/zloirock/core-js/issues/514#issuecomment-523524472
        loader: 'babel-loader',
        options: {
          plugins: ['syntax-dynamic-import'],
          compact: false,
          cacheDirectory: true,
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                useBuiltIns: 'entry',
                corejs: 3,
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
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: `fonts/[name]${
            IS_PRODUCTION ? '.[contenthash:8]' : ''
          }[ext][query]`,
        },
      },
      {
        test: /\.(png|svg|jpe?g|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: `images/[name]${
            IS_PRODUCTION ? '.[contenthash:8]' : ''
          }[ext][query]`,
        },
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    'imagemin-gifsicle',
                    'imagemin-jpegtran',
                    'imagemin-pngquant',
                    'imagemin-svgo',
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin({})],
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
      name: 'true',
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `stylesheets/[name]${
        IS_PRODUCTION ? '.[contenthash:8]' : ''
      }.css`,
      chunkFilename: '[id].css',
    }),
    new WebpackAssetsManifest({
      output: 'manifest.json',
    }),
    new CopyPlugin({
      patterns: [
        {
          context: configPaths.frameworks.source,
          from: '**/questions/**/*.yml',
          to: path.resolve(configPaths.frameworks.output, '[path][name].json'),
          toType: 'template',
          noErrorOnMissing: true,
          transform: transformManifestFile(frameworksService.transformQuestion),
        },
        {
          context: configPaths.frameworks.source,
          from: '**/manifests/**/*.yml',
          to: path.resolve(configPaths.frameworks.output, '[path][name].json'),
          toType: 'template',
          noErrorOnMissing: true,
          transform: transformManifestFile(frameworksService.transformManifest),
        },
      ],
    }),
  ],
}

const webpackEnvironment = IS_PRODUCTION ? 'production' : 'develop'
const environmentConfig = require(`./webpack.config.${webpackEnvironment}`)
const webpackConfig = merge(commonConfig, environmentConfig)

module.exports = webpackConfig
