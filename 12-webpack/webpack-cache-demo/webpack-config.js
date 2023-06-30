
const path = require('path');
const webpack = require('webpack')
const config = require('./config')

const webpackConfig = config;
const compiler = webpack(webpackConfig)
compiler.run((err, stats) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stats.toString());
});