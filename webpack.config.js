var HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require("webpack");

module.exports = {
    entry: [
        //"babel-polyfill",
        "./src/bootstrap.js",
    ],
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file?name=templates/[name]-[hash:6].html'
            },
            //{
            //    test: [/fontawesome-webfont\.svg/, /fontawesome-webfont\.eot/, /fontawesome-webfont\.woff/, /fontawesome-webfont\.woff2/, /fontawesome-webfont\.ttf/],
            //    loader: 'file?name=fonts/[name].[ext]'
            //},
            {   test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    "plugins": [
                        "angular2-annotations",
                        "transform-decorators-legacy",
                        "transform-class-properties",
                        "transform-flow-strip-types"
                    ],
                    presets: ['es2015'],
                }
            },

        ],
        //noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /.+zone\.js\/lib\/.+/]

    },
    resolve: {
        modulesDirectories: [
            'node_modules'
        ],
        extensions: ['', '.js']
    },
    devtool: 'source-map', // for faster builds use 'eval'
    debug: true, // remove in production
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/html/index.html'
        })
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    },
        //    sourceMap: true,
        //    mangle: false
        //})
    ]
};