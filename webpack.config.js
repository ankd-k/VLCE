const path = require('path');

const main = {
  target: 'electron-main',
  entry: './src/main/index.ts',
  cache: true,
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  node: {
    __dirname: false,
    __filename: false
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
  }
};

const renderer = {
  target: 'electron-renderer',
  entry: './src/renderer/index.ts',
  cache: true,
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist/script'),
    filename: 'renderer.js'
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
  }
};

module.exports = [
  main,
  renderer
];
