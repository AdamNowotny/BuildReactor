/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const WebpackErrorNotificationPlugin = require('webpack-error-notification');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
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
    modulesDirectories: ["node_modules"],
    extensions: ['', '.js'],
    root: path.join(__dirname, "src")
  },

  plugins: [
    new WebpackErrorNotificationPlugin(/* strategy */),
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
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js",
      minChunks: 3, // Modules must be shared between 3 entries
      chunks: ["settings", "dashboard", "popup"]
    }),
    new CopyWebpackPlugin([
      { from: '../manifest.json' },
      { from: '../img', to: 'img' },
      { from: 'services/*/*.{png,svg}' }
    ]),
    new ExtractTextPlugin("[name].css")
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: [
            ["env", {
              "targets": {
                "chrome": "40",
                "firefox": "50"
              },
              "debug": true
            }]
          ],
          "plugins": [
            ["transform-object-rest-spread", { "useBuiltIns": true }]
          ]
        }
      },
      {
        test: /\.?css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      },
      {
        test: /\.(png|jpg)$/,
        loader: "url?limit=10000&name=/img/[name].[ext]"
      },
      {
        test: /\.(svg)/,
        loader: 'url?limit=10000&name=/img/[name].[ext]'
      },
      {
        test: /\.(ttf|eot|otf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file?name=/fonts/[name].[ext]"
      },
      {
        test: /\.html$/,
        exclude: /index\.html$/,
        loader: `ngtemplate?relativeTo=${path.resolve(__dirname, 'src')}/!html`
      },
      {
        test: /(angular-mocks|angular-route|angular-ui-bootstrap|angular-ui-utils|angular-animate)/,
        loader: 'imports?angular'
      }
    ]
  },

  devServer: {
    contentBase: "./src"
  }
};
