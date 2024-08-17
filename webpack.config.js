/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: path.join(__dirname, 'src'),
    entry: {
        settings: './settings/main.js',
    },
    output: {
        path: path.join(__dirname, 'dist/build'),
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
        modules: ['src', 'node_modules'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'settings/index.html',
            filename: 'settings.html',
            inject: 'body',
            chunks: ['commons', 'settings'],
            minify: false,
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: '../manifest.json', to: 'manifest.json' },
                { from: '../img', to: 'img' },
                { from: 'services/*/*.{png,svg}' },
            ],
        }),
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'defaults' }]],
                    },
                },
            },
            {
                test: /\.(ts|tsx)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.?css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.(svg|ttf|eot|otf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.html$/,
                exclude: /index\.html$/,
                use: [
                    {
                        loader: 'ngtemplate-loader',
                        options: {
                            relativeTo: 'src',
                        },
                    },
                    { loader: 'raw-loader' },
                ],
            },
            {
                test: /(angular-route|angular-animate)/,
                loader: 'imports-loader',
                options: {
                    type: 'commonjs',
                    imports: [
                        {
                            syntax: 'single',
                            moduleName: 'angular',
                            name: 'angular',
                        },
                    ],
                },
            },
        ],
    },
};
