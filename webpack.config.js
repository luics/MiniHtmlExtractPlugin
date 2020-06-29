const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniHtmlExtractPlugin = require('./src');

const sourceMap = false;
const filename = (ext = '[ext]') => `[name].${ext}?[contenthash]`;

module.exports = {
  entry: {
    app: './test/app',
    subapp: './test/subapp',
    main: './test',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: filename('js')
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: filename('css'), }),
    new MiniHtmlExtractPlugin({ filename: filename('html'), entries: ['app', 'subapp'] }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/i, loader: 'ts-loader' },
      {
        include: [path.resolve(__dirname, 'test/subapp/Subapp.tsx')], 
        use: [
          { loader: './src/loader', options: {} },
        ]
      },
      { test: /\.scss$/i, loader: 'style-loader!css-loader!sass-loader' },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/i, loader: 'file-loader',
        options: { outputPath: 'font', name: filename() },
      },
      {
        test: /\.(jpg|jpeg|png|gif|webp)$/i, loader: 'file-loader',
        options: { outputPath: 'img', name: filename() },
      },
      {
        test: /(favicon\.ico)|(index\.html)$/i, loader: 'file-loader',
        options: { outputPath: '.', name: filename() },
      },
    ]
  },
  devtool: sourceMap ? 'source-map' : false,
};