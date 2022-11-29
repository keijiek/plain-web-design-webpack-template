const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
// const devserver = require('webpack-dev-server');

const outputFile = '[name]';// module.exports.entry に記述する エントリーポイント設定のオブジェクトのキー名を表す文字列。

// web-dev-server setting ************************************************
const webDevServerSetting = {
  open: true,
  port: 8080,
  host: 'localhost',
  // contentBase: path.resolve(__dirname, 'dist'),
  // publicPath: path.resolve(__dirname, 'dist'),
};

// webpack.common.js の方で要求されている引数を渡すこと。
module.exports = merge(common(outputFile), {
  mode: 'development',
  // devtool: 'source-map',
  devtool: 'eval-source-map',
  devServer: webDevServerSetting,
  // watch モード
  watch: true,
  watchOptions: {
    ignored: ['**/node_modules'],
  },
});
