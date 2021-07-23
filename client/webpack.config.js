const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {getIfUtils, removeEmpty} = require('webpack-config-utils')
const REGEX_BABEL_LOADER = /\.(js|jsx)$/;
const REGEX_STYLE_LOADER = /\.(css|.s[ac]ss)$/;
const REGEX_FILE_LOADER = /\.(png|jpg|jpeg|gif|svg|ico|ttf|woff|woff2)$/;
module.exports =function(env) {
  const {ifProduction, ifNotProduction} = getIfUtils(env);
  const wepackConfig={
  mode: ifProduction('production', 'development'),
  entry: path.resolve(__dirname, './src/index.js'),
//   entry: removeEmpty({
//     app: ifProduction('./indexWithoutCSS', './indexWithCSS'),
//     css: ifProduction('./style.scss')
//  }),
 output: {
   chunkFilename: ifProduction('js/[id].[contenthash].js', 'js/[name].js'),
   filename: ifProduction('js/[id].[contenthash].js', 'js/[name].js'),
 },
  module: {
    rules: [
      {
        test:REGEX_BABEL_LOADER,
        exclude:/node_modules/
      },
      {
        test: REGEX_STYLE_LOADER,
        use: [
          ifProduction ? ("style-loader") : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: REGEX_BABEL_LOADER,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()].concat(ifProduction ? [] : [new MiniCssExtractPlugin()]), 
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
  },
}
return wepackConfig;
}