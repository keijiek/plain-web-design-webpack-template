const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const outputFile = '[name].[chunkhash]';// webpack.common.js への引数の値


// terser-webpack-plugin の設定 ************************************************
// 役割: JS file の minify. console.log() やコメントや不要なtxtファイルの除去.
const terserPluginSetting = new TerserPlugin({
  parallel: true, // 高速化
  extractComments: false,// def=true, 不要な txt files の出力を妨げるか。
  terserOptions: {
    compress: {
      drop_console: true,// remove all 'console.log()'
    }
  },
});


// css-minimizer-webpack-plugin ************************************
// 役割: 出力された css file の minify, 今のところ引数が無いので分離する意味は無いが、後々のために。
// ※依存パッケージに非推奨あり stable@0.1.8
const cssMinimizerSetting = new CssMinimizerPlugin();


/**
 * 設定の本編 ************************************************************
 */
module.exports = merge(common(outputFile), {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      terserPluginSetting,
      cssMinimizerSetting
    ],
  }
});