/**
 * Created by wanghan1 on 2017/8/18.
 */

const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:{
        a:__dirname +'\\src\\js\\main1.js',

    },
    output:{
        path:__dirname +'\\dist',
        filename:'js\\[name]-[chunkhash]bundle.js',
        chunkFilename: "[id].bundle.js",
        // publicPuath:""   //占位符   用来替换前缀域名   让js 为绝对地址。
        // publicPath:"http://cdn.com/"   //占位符   用来替换前缀域名   让js 为绝对地址。
    },
    // module: {
    //     loaders: [
    //         {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    //
    //         { test: /\.jade$/, loader: "jade" },
    //         // => "jade" loader is used for ".jade" files
    //
    //         { test: /\.css$/, loader: "style!css" },
    //         // => "style" and "css" loader is used for ".css" files
    //         // Alternative syntax:
    //         { test: /\.css$/, loaders: ["style", "css"] },
    //     ]
    // },
    plugins: [

        new htmlWebpackPlugin({
            template:__dirname+'\\index.html',
            filename:'page1.html',
            inject:'head',
            // inject:false,
            title:"hehe1",
            // excludeChunks: ['main','a']

        } ),

    ]
}