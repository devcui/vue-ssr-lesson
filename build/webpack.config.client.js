const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

let config 

const defaultPlugins = [
  new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html'
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    })
]

const devServer = {
  contentBase: 'client',
  hot: true,
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  }
}

if (isDev) {
  config = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer,
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader', 
            {
              loader: 'css-loader',
              options: {
                // modules: true,
                localIdentName: '[local]_[hash:base64:8]',
                camelCase: true
              }
            }, 
            'postcss-loader', 
            'sass-loader'
          ]
        }
      ]
    },
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ])
  })
  
} else {
  config = merge(baseConfig, {
    mode: 'production',
    entry : {
      app: path.join(__dirname, '../client/main.js'),
      // vendor: ['vue', 'vue-router', 'vuex']
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {}
            }, 
            'css-loader', 
            'postcss-loader', 
            'sass-loader'
          ]
        }
      ]
      
    },
    plugins: defaultPlugins.concat([
      new MiniCssExtractPlugin({
        filename: 'styles.[contentHash:8].css',
        // chunkFilename: '[id].css'
      })
    ]),
    optimization: {
      splitChunks:{
        chunks: 'all'
      }
    }
  })
  
}

module.exports = config