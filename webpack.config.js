const
  webpack = require('webpack'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  // { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'),
  AssetsPlugin = require('assets-webpack-plugin'),
  { ReactLoadablePlugin } = require('@7rulnik/react-loadable/webpack'),
  LodashModuleReplacementPlugin = require('lodash-webpack-plugin'),
  path = require('path'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  rootWebDir = 'public',
  distPublicDir = '/dist/',
  distDir = `${rootWebDir}/dist`,
  isProd = mode => mode === 'production';

module.exports = (env, argv) => ({
  entry: {
    main: [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash'].concat(isProd(argv.mode) ? ['transform-remove-console'] : []),
              presets: [
                ['env', { modules: false, targets: { node: 4 } }],
                'react', 'es2017', 'stage-0'
              ],
              sourceMaps: true,
              sourceMapTarget: 'file',
              sourceFileName: 'sources[0]'
            },
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'svg-react-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['src', 'node_modules']
            }
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src'),
      path.join(__dirname, rootWebDir),
      path.join(__dirname)
    ]
  },
  output: {
    path: path.resolve(__dirname, distDir),
    publicPath: isProd(argv.mode) ? distPublicDir : `http://localhost:3000${distPublicDir}`,
    filename: isProd(argv.mode) ? '[hash].main.js' : 'main.js',
    chunkFilename: isProd(argv.mode) ? '[name].[chunkhash].js' : '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../public'),
      verbose: true,
      dry: false
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'main.css',
      chunkFilename: 'main_chunk.css'
    }),
    new webpack.optimize.SplitChunksPlugin({ // eslint-disable-line
      optimization: {
        minimize: isProd(argv.mode),
        runtimeChunk: { name: 'manifest' },
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            commons: {
              test: /\.jsx?$/,
              chunks: 'all',
              name: 'manifest',
              enforce: true,
            },
          },
        },
      },
    }),

    // new BundleAnalyzerPlugin(),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /ru|ua/
    ),
    new ReactLoadablePlugin({
      filename: `${path.resolve(__dirname, distDir)}/react-loadable.json`,
    }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.resolve(__dirname, distDir)
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, distPublicDir),
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true
      }
    }
  }
});
