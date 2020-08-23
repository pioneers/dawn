import * as path from 'path';

const modules = {
  rules: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{ loader: 'ts-loader' }]
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      enforce: 'pre',
      loader: 'eslint-loader',
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
  ],
};

export default [
  {
    entry: './renderer/index.tsx',
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'bundle.js',
    },
    target: 'electron-renderer',
    module: modules,
  },
  {
    entry: './main/main-process.ts',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'main.js',
    },
    target: 'electron-main',
    node: {
      __dirname: false,
      __filename: false,
    },
    module: modules,
  },
];
