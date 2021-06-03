const path = require('path');

module.exports = {
  target: 'node',
  entry: { main: './src' },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: "commonjs2",
  },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      { test: /\.ts$/i, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.html$/i, loader: 'raw-loader' },
    ]
  },
  devtool: false,
  node: { fs: "empty" } // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
};