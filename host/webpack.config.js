const path = require('path');
const webpack = require('webpack');

const { ModuleFederationPlugin } = require("webpack").container;

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const deps = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  devtool: false,
  entry: ["regenerator-runtime/runtime.js", path.resolve(__dirname, './index.js')],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
        'node_modules',
        './src'
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].[chunkhash].js',
    publicPath: 'http://localhost:4000/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './build'),
    compress: true,
    port: 4000,
    open: true,
    hot: true
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({}),
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "host",
      library: { type: "var", name: "host" },
      filename: "remoteEntry.js",
      remotes: {
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      excludeChunks: ["host"],
    })
  ]
};