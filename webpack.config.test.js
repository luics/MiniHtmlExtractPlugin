const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { version: v } = require('./package.json');
const MiniHtmlExtractPlugin = require('.');

const name = (ext = '[ext]') => `${v}/[name].${ext}?[contenthash]`;

module.exports = {
  entry: {
    app: './test/app',
    subapp: './test/subapp',
    main: './test',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: name('js'),
    publicPath: `https://cdn.com/`,
  },
  plugins: [
    new CleanWebpackPlugin(),

    // all entries, '[name].html' found in '[output.path]'
    new MiniHtmlExtractPlugin({ filename: name('html') }),

    // specific entries
    new MiniHtmlExtractPlugin({ filename: name('html'), entries: ['app', 'subapp'] }),

    // filename: '[name].[ext]?[contenthash]'
    new MiniHtmlExtractPlugin({ filename: `${v}/[name]-filename.html`, entries: ['app'] }),

    // template content with builtin placeholders: '[entryName]', '[entryJsFilename]'
    new MiniHtmlExtractPlugin({
      filename: `${v}/[name]-template.html`, entries: ['app'],
      template: '<html><body>[entryName]<div id="root"></div><script src="[entryJsFilename]"></script></body></html>'
    }),

    // template content with custom placeholders: '[xxx]', '[yyy]' ...
    new MiniHtmlExtractPlugin({
      filename: `${v}/[name]-template-placeholder.html`, entries: ['app'],
      template: '<html><body>[xxx][yyy][yyy]<div id="root"></div><script src="[entryJsFilename]"></script></body></html>',
      placeholder: { xxx: 'a', yyy: 'p' }
    }),

    // template file(absolute path) with builtin placeholders: '[entryName]', '[entryJsFilename]'
    new MiniHtmlExtractPlugin({
      filename: `${v}/[name]-templatePath.html`, entries: ['app'],
      templatePath: path.resolve(__dirname, './test/template.html')
    }),

    // template file(absolute path) with custom placeholders: '[xxx]', '[yyy]' ...
    new MiniHtmlExtractPlugin({
      filename: `${v}/[name]-templatePath-placeholder.html`, entries: ['app'],
      templatePath: path.resolve(__dirname, './test/template-placeholder.html'),
      placeholder: { xxx: 'a', yyy: 'p' }
    }),
  ],
  resolve: { extensions: ['.ts', '.tsx', '.js'], },
  module: {
    rules: [
      { test: /\.tsx?$/i, loader: 'ts-loader' },
    ]
  },
  devtool: false,
};