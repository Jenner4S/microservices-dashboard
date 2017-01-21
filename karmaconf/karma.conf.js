var webpackConfig = require('../webpackconf/webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '../',

        frameworks: ['jasmine'],

        files: [
            {pattern: './karmaconf/spec-bundle.js', watched: false}
        ],

        preprocessors: {
            './karmaconf/spec-bundle.js': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    };

    config.set(_config);
};