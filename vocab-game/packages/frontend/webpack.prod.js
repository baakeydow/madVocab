const common = require('./webpack.common.js');
const path = require('path');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

let config = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, '../build/front-dist'),
    }
});

if (process.env.INSPECT === 'true') {
    config.plugins.push(new BundleAnalyzerPlugin({openAnalyzer: false, analyzerPort: 7777}));
    config = new SpeedMeasurePlugin().wrap(config);
}

module.exports = config;
