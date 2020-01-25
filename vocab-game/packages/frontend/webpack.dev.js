const merge = require('webpack-merge');
const path = require('path');

const settings = require('./settings.json');
const api = settings.contextPath

module.exports = merge(require('./webpack.common.js'), {
    mode: 'development',
    devtool: 'source-map',
    output: {
        publicPath: settings.contextPath
    },
    devServer: {
        host: '0.0.0.0',
        port: 9000,
        https: settings.https === true,
        contentBase: path.join(__dirname, '../build/front-dist'),
        compress: true,
        allowedHosts: ['.21times2.com'],
        disableHostCheck: false,
        historyApiFallback: true,
        hot: true,
        inline: true,
        open: false,
        proxy: {
            [api]: {
                target: settings.backendUrl,
                secure: false,
                changeOrigin: true
            }
        }
    }
});
