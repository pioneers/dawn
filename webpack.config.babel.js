import * as path from 'path';

const modules = {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.(png|jpe?g|gif)$/i,
      use: ['file-loader'],
    },
    {
      test: /\.(ts|tsx)?$/,
      exclude: /node_modules/,
      use: [{ loader: 'ts-loader' }]
    },
    {
      test: /\.js$/,
      exclude: [/node_modules/, /protos/],
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint/lib/cli-engine/formatters/stylish')
      },
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
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'bundle.js',
    },
    target: 'electron-renderer',
    module: modules,
  },
  
  {
    entry: './dashboard/index.tsx',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: "dash.js",
    },
    target: 'electron-renderer',
    module: modules,
  },
  
  {
    entry: './main/main-process.ts',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
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
