const path = require('path');
const MiniHtmlExtractPlugin = require('.');

module.exports = {
  entry: {
    app: './test/app',
    subapp: './test/subapp',
    main: './test',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: `[name].js?[contenthash]`
  },
  plugins: [
    // all entries, '[name].html' found in '[output.path]'
    new MiniHtmlExtractPlugin(),

    // specific entries
    new MiniHtmlExtractPlugin({ entries: ['app', 'subapp'] }),

    // filename: '[name].[ext]?[contenthash]'
    new MiniHtmlExtractPlugin({ filename: `[name]-filename.html`, entries: ['app'] }),

    // template content with builtin placeholders: '[entryName]', '[entryJsFilename]'
    new MiniHtmlExtractPlugin({
      filename: `[name]-template.html`, entries: ['app'],
      template: '<html><body>[entryName]<div id="root"></div><script src="[entryJsFilename]"></script></body></html>'
    }),

    // template content with custom placeholders: '[xxx]', '[yyy]' ...
    new MiniHtmlExtractPlugin({
      filename: `[name]-template-placeholder.html`, entries: ['app'],
      template: '<html><body>[xxx][yyy][yyy]<div id="root"></div><script src="[entryJsFilename]"></script></body></html>',
      placeholder: { xxx: 'a', yyy: 'p' }
    }),

    // template file(absolute path) with builtin placeholders: '[entryName]', '[entryJsFilename]'
    new MiniHtmlExtractPlugin({
      filename: `[name]-templatePath.html`, entries: ['app'],
      templatePath: path.resolve(__dirname, './test/template.html')
    }),

    // template file(absolute path) with custom placeholders: '[xxx]', '[yyy]' ...
    new MiniHtmlExtractPlugin({
      filename: `[name]-templatePath-placeholder.html`, entries: ['app'],
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