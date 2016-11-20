var webpack = require('webpack');
var path = require('path');

module.exports = {
  
  devtool: 'cheap-module-source-map',
  entry: {
    index: ['babel-polyfill', path.resolve(__dirname + '/dev/index.jsx')]
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].out.js"
  },
  
  resolve: {
      extensions: ['', '.js', '.jsx'],
      /*alias: {
        stores: __dirname + '/js/stores',
        vendor: __dirname + '/js/vendor',
        lib: __dirname + '/js/lib',
        domains: __dirname + '/domains',
        LuvitComponent: __dirname + '/js/lib/components/base/luvitComponent'
      }*/
  },
  
  module: {
    plugins: [
        new webpack.optimize.DedupePlugin()
    ],
    loaders: [
      { test: /\.(json)$/, loader: 'json-loader' },
      { test: /\.(js|jsx|es|es6)$/, 
        loader: 'babel-loader',
        exclude: pathregexes([
            "node_modules",
        ])
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      
      { test: /\.(jpg|png|gif)$/, loader: 'file-loader' }
    ]
  }
};


function pathregexes(paths) {
	// webpack doesnt normalize directory separators, so itll work differently on unix and windows. :/
	var directorySeparator = '[\\\\\\/]';
	var escapedPaths = paths
		.map(function (f) { return f.replace(/[()\[\]\/\.]/g, function (f) { return f === '/' ? directorySeparator : '\\' + f }); })
		.join('|');
	return new RegExp('(^|' + directorySeparator + ')(' + escapedPaths + ')($|' + directorySeparator + ')', 'i');
}
