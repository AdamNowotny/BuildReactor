/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: '', // disable JS eval
  context: path.join(__dirname, "src"),
  entry: {
    background: "./core/main.js",
    popup: "./popup/main.js",
    settings: "./settings/main.js",
    dashboard: "./dashboard/main.js"
  },
  output: {
    publicPath: './',
    path: path.join(__dirname, "dist/BuildReactor"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js"
  },
  resolve: {
    modules: ["src", "node_modules"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'settings/index.html',
      filename: 'settings.html',
      inject: 'body',
      chunks: ['commons', 'settings'],
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: 'popup/index.html',
      filename: 'popup.html',
      inject: 'body',
      chunks: ['commons', 'popup'],
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: 'dashboard/index.html',
      filename: 'dashboard.html',
      inject: 'body',
      chunks: ['commons', 'dashboard'],
      minify: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '../manifest.json' },
        { from: '../img', to: 'img' },
        { from: 'services/*/*.{png,svg}' }
      ]
    }),
    new MiniCssExtractPlugin()
  ],

  optimization: {
    namedModules: true,
    splitChunks: {
        chunks: 'all',
        name: 'commons',
        minChunks: 2
    },
    noEmitOnErrors: true,
    concatenateModules: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.?css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(svg|ttf|eot|otf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.html$/,
        exclude: /index\.html$/,
        use: [
          { 
            loader:'ngtemplate-loader',
            options: {
              relativeTo: 'src'
            }
          },
          { loader: 'html-loader' }
        ]
      },
      {
        test: /(angular-mocks|angular-route|angular-animate)/,
        loader: 'imports-loader',
        options: {
          type: 'commonjs',
          imports: [
            {
              syntax: 'single',
              moduleName: 'angular',
              name: 'angular',
            }
          ]
        }
      }
    ]
  },

  devServer: {
    contentBase: "./src"
  }
};
