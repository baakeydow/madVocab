const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Marked = require("marked");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentWebpackPlugin = require('moment-locales-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'MadVocabFront': ['@babel/polyfill', path.join(__dirname, 'src/index.tsx')]
    },
    output: {
        filename: '[name].js',
        chunkFilename: 'modules/[name].js',
        path: path.resolve(__dirname, '../build/front-dist'),
        library: 'MadVocab/Game/Front',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        crossOriginLoading: 'anonymous'
    },
    target: 'web',
    resolve: {
        extensions: ['.tsx', '.ts', '.scss', '.css', '.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
              test: /\.ts[x]?$/,
              enforce: 'pre',
              use: [{
                  loader: 'tslint-loader',
                  options: {}
              }]
            },
            {
              test: /\.ts[x]?$/,
              use: [{
                  loader: 'babel-loader',
                  options: {
                      presets: [
                          ["@babel/preset-env", {
                              targets: {
                                  ie: "11"
                              }
                          }],
                          "@babel/preset-react"
                      ],
                      plugins: [
                          "@babel/plugin-syntax-dynamic-import"
                      ],
                      cacheDirectory: true
                  }
              }, {
                  loader: 'awesome-typescript-loader',
                  options: {
                      useCache: true
                  }
              }],
              exclude: /node_modules/
            },
            {
                test: /\.md$/,
                exclude: /node_modules/,
                use: [{
                    loader: "html-loader"
                }, {
                    loader: "markdown-loader",
                    options: {
                        pedantic: true,
                        renderer: new Marked.Renderer()
                    }
                }]
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'url-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/images'
                }
            }, {
                test: /\.(eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts'
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(scss|sass)$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            }
        ]
    },
    plugins: [
        new MomentWebpackPlugin({
            localesToKeep: ['fr']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new HtmlWebpackPlugin({
            favicon: "./Public/favicon.ico",
            filename: 'index.html',
            template: path.join(__dirname, 'Public/templates/index.html'),
            inject: 'head'
        }),
        new CopyWebpackPlugin([{
          from: path.join(__dirname, 'Public'),
          to: path.resolve(__dirname, '../build/front-dist')
        }])
    ],
    optimization: {
        moduleIds: 'named',
        chunkIds: 'named'
    }
};
