const path = require('path');

module.exports = {
  target: 'electron-renderer',
  entry: './src/ts/index.ts',
  cache: true,
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test:/\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          configFile: './tslint.json',
          typeCheck: true,
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.json',
    ]
  },
};
