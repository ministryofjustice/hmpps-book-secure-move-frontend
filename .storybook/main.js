const custom = require('../webpack.config')
const paths = require('../config/paths')
const configPaths = require('../config/paths')
const path = require('path')

module.exports = {
  stories: ['../common/**/*.stories.js'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-notes',
    '@storybook/preset-scss',
  ],
  webpackFinal: config => {
    return {
      ...config,
      module: {
        ...config.module,
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
              { loader: 'style-loader' },
              // {
              //   loader: MiniCssExtractPlugin.loader,
              //   options: {
              //     publicPath: '../',
              //   },
              // },
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
          // Nunjucks loader

          {
            test: /\.njk$/,
            use: [
              {
                loader: 'simple-nunjucks-loader',
                options: {
                  searchPaths: [
                    paths.govukFrontend,
                    paths.mojFrontend,
                    paths.templates,
                    paths.components,
                    paths.app,
                    '.',
                  ],
                },
              },
              {
                loader: 'nunjucks-relative-loader',
                options: {
                  // search: '{%- include "./template.njk" -%}',
                  // replace: '{%- include "../template.njk" -%}',
                  // flags: 'g',
                  searchPaths: [
                    paths.govukFrontend,
                    paths.mojFrontend,
                    paths.templates,
                    paths.components,
                    paths.app,
                  ],
                },
              },
            ],
          },
        ],
      },
    }
  },
}
