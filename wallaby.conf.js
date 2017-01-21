var wallabyWebpack = require('wallaby-webpack');
// if you use the webpack defined variable ENV in any components
// uncomment the following lines and the plugins section in webpackPostprocessor below
//const DefinePlugin = require('webpack/lib/DefinePlugin');
//const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

var webpackPostprocessor = wallabyWebpack({
    entryPatterns: [
        'karmaconf/spec-bundle.js',
        'src/**/*spec.js'
    ],

    module: {
        loaders: [
            // if you use templateUrl in your components and want to inline your templates uncomment the below line
            // {test: /\.js$/, loader: 'angular2-template-loader', exclude: /node_modules/},

            // if importing .scss files in your component styleUrls uncomment the following line
            // { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
            {test: /\.css$/, loader: 'raw-loader'},
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.html$/, loader: 'raw-loader'},
            {test: /karma-require/, loader: 'null'}
        ]
    },
    // plugins: [
    //     new DefinePlugin({
    //       'ENV': JSON.stringify(ENV)
    //     })
    // ]
});

module.exports = function () {

    return {
        files: [
            {pattern: 'karmaconf/spec-bundle.js', load: false},
            {pattern: 'karmaconf/karma-require.js', load: false},
            {pattern: 'src/**/*.ts', load: false},
            {pattern: 'src/**/*.css', load: false},
            {pattern: 'src/**/*.html', load: false},
            {pattern: 'src/**/*.json', load: false},
            {pattern: 'src/**/*spec.ts', ignore: true},
            {pattern: 'src/**/*.d.ts', ignore: true}
        ],

        tests: [
            {pattern: 'src/**/*spec.ts', load: false},
            {pattern: 'test/**/*spec.ts', load: false}
        ],

        testFramework: 'jasmine',

        postprocessor: webpackPostprocessor,

        setup: function () {
            window.__moduleBundler.loadTests();
        },

        debug: true,

        env: {
            kind: 'electron'
        }
    };
};