const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const REGEX_BABEL_LOADER = /\.(js|jsx)$/;
const REGEX_STYLE_LOADER = /\.(css|.s[ac]ss)$/;
const REGEX_FILE_LOADER = /\.(png|jpg|jpeg|gif|svg|ico|ttf|woff|woff2)$/;
// const devMode= process.env;
// console.log(devMode)
// const devMode= env.development;
/*
Ex: console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
Note %s is where in the string (the second argument) gets injected.
\x1b[0m resets the terminal color so it doesn't continue to be the chosen color anymore after this point.
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/
 
module.exports =function(env) {  
  const devMode= env.development;
  if (!devMode) {
    console.log('\x1b[42m%s\x1b[0m','========== Welcome to production ==========');
  }
  if (devMode) {
    console.log('\x1b[43m%s\x1b[0m','========== Debugging output ==========');
  }
  const wepackConfig={
  mode: devMode ?'production':'development',
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test:REGEX_BABEL_LOADER,
        exclude:/node_modules/
      },
      {
        test: REGEX_STYLE_LOADER,
        use: [
          devMode ? ("style-loader") : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ]
      },
      {
        test: REGEX_BABEL_LOADER,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test:REGEX_FILE_LOADER,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    chunkFilename: devMode?'js/[id].[contenthash].js':'js/[name].js',
    filename: devMode?'js/[id].[contenthash].js':'js/[name].js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new HtmlWebpackPlugin({  // Also generate a test.html
    filename: 'index.html',
    template: '../server/templates/index.html'
  })].concat(devMode ? [] : [new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "css/[name].css",
    chunkFilename: "css/[id].css",
  })]), 
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
  },
}
return wepackConfig;
}