const path = require('path');
const MiniHtmlExtractPlugin = require('./dist').default;

const filename = (ext = '[ext]') => `[name].${ext}?[contenthash]`;

module.exports = {
  entry: {
    app: './test/app',
    subapp: './test/subapp',
    main: './test',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: filename('js')
  },
  plugins: [
    new MiniHtmlExtractPlugin({ filename: filename('html'), entries: ['app', 'subapp'] }),
  ],
  resolve: { extensions: ['.ts', '.tsx', '.js'], },
  module: {
    rules: [
      { test: /\.tsx?$/i, loader: 'ts-loader' },
    ]
  },
  devtool: false,
};