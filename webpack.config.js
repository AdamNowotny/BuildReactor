/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: path.join(__dirname, 'src'),
    entry: {
        'service-worker': './service-worker/main.ts',
        popup: './popup/main.js',
        settings: './settings/main.js',
        dashboard: './dashboard/main.js',
    },
    output: {
        path: path.join(__dirname, 'dist/build'),
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['src', 'node_modules'],
        fallback: {
            stream: require.resolve('stream-browserify'),
            buffer: false,
            timers: false,
            util: false,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'settings/index.html',
            filename: 'settings.html',
            inject: 'body',
            chunks: ['commons', 'settings'],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            template: 'popup/index.html',
            filename: 'popup.html',
            inject: 'body',
            chunks: ['commons', 'popup'],
            minify: false,
        }),
        new HtmlWebpackPlugin({
            template: 'dashboard/index.html',
            filename: 'dashboard.html',
            inject: 'body',
            chunks: ['commons', 'dashboard'],
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
        new ZipPlugin({
            path: '..',
            filename: 'build-reactor.zip',
        }),
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
                test: /\.ts$/,
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
