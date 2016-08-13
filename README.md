# webpack-touch

Webpack plugin for touch a file when done to tell other process to take action.

# Usage

```javascript
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const WebpackTouch = require('webpack-touch');
module.exports = {
    entry: {
      index: './assets/js/index'
    },
    output: {
        path: './public/dist/js/',
        filename: '[name].js',
        publicPath: '/assets/dist/js/'
    },
    module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              plugins: [],
              presets: ['es2015', 'react']
            }
          }
        ]
    },
    plugins: [
      new BundleTracker({path: __dirname, filename: './run/webpack-stats.json', indent: '  '}),
      new WebpackTouch({filename: './run/reload.touch', delay: 2000})
    ]
}
```
