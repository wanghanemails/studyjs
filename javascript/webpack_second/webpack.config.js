/**
 * Created by wanghan1 on 2017/8/18.
 */

const webpack = require('webpack');
const html_webpacl_plugin = require('html-webpack-plugin');
module.exports = {
    entry:{
        page1:[__dirname +'\\src\\js\\main1.js',__dirname +'\\src\\js\\main2.js'],
        page2:__dirname +'\\src\\js\\main3.js'
    },
    output:{
        path:__dirname +'\\dist',
        filename:'js\\[name]-[hash]bundle.js',
        chunkFilename: "[id].bundle.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},

            { test: /\.jade$/, loader: "jade" },
            // => "jade" loader is used for ".jade" files

            { test: /\.css$/, loader: "style!css" },
            // => "style" and "css" loader is used for ".css" files
            // Alternative syntax:
            { test: /\.css$/, loaders: ["style", "css"] },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new html_webpacl_plugin({
            template:__dirname+'\\index.html',
            inject:'head',
            title:"hehe",
            date:new Date()
        } ),
    ]
}