const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * asset-module (webpack 標準機能)の設定 ************************************************
 * この要素を module.rules[] の配列に入れると機能。
 * 画像ファイルやフォントファイルなどを、src から dist にコピーする機能。 
 * test: 対象ファイルの拡張子(正規表現)
 * include: コピー元のパス
 * generator.filename: 出力されるファイルのパス。module.exports.output.path の値(dist等の出力先ディレクトリ) を root としたパスであること。module.exports.output.output.assetModuleFilename と同じ機能とのこと。
 * type: 'asset/resource' : 画像等を扱うことを明示。
 */
const assetModuleSetting = {
  // test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
  test: /\.(png|jpe?g|gif|svg)/i,
  include: path.resolve(__dirname, 'src', 'images'),
  generator: {
    // filename: `./images/[name].[contenthash][ext]`,
    filename: `./images/[name].[ext]`,
  },
  type: 'asset/resource',
};


// html-loader 設定, 何の役に立っているか不明なので要調査  ************************************************
const htmlLoader = {
  test: /.html$/i,
  loader: 'html-loader',
};

// HTML Webpack Plugin 用の設定群 ************************************************
/**
 * ファイル名を引数に、HtmlWebpackPlugin 設定を作って返す関数
 * @param {string} filename : html のファイル名, 拡張子抜き。
 * @returns HtmlWebpackPlugin オブジェクト
 * inject: script タグの設置場所。body=body末尾, head=head末尾
 * filename: 出力先(dist等)をrootとした、出力されるhtmlファイルのパス
 * template: 出力元のパス, フルパスか、プロジェクトルートを起点としたパス
 * chunks: 読み込むjsファイルを指定。拡張子抜き。{$filename(=引数)}とすれば同名のjsを読み込もうとする。
 */
const makeHtmlWebpackPlugin = (filename) => {
  return new HtmlWebpackPlugin({
    inject: 'body',
    filename: `${filename}.html`,
    template: `./src/htmls/${filename}.html`,
    chunks: ['index'],
  })
};

// html side entry points. Add above function as needed.
/**
 * HtmlWebpackPlugin 設定の配列。上記の関数を用いる。
 * 例: `makeHtmlWebpackPlugin('index')` で index.html を対象とした設定をひとつ作る。
 * ゆくゆくは、glob的な機能で、自動で全htmlファイルを認識し、必要なだけ上記関数を呼ぶようにしたい。
 * 完成した配列は、exports.plugins[] 内に `...htmlWebpackPlugins` と展開して機能させる。
 */
const htmlWebpackPlugins = [
  makeHtmlWebpackPlugin('index'),
];


/**
 * CSS 関連設定 ************************************************
 */

/**
 * MiniCssExtract 設定。css を外部ファイル化する(*.cssにする) プラグイン
 * filename: 最終的に出力する css ファイルのパス。出力先ディレクトリ(dist等)をルートとしたパスであること。
 */
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename:'styles/style.css'
});

/**
 * CSSの各種設定を纏めるオブジェクト。module.rules[] 内に配置する事で機能。
 *   test: 処理対象となる拡張子。
 *   include: 処理対象となるsrc側のディレクトリのフルパス
 *   use[]: ローダー(個々のcss関連設定)の配列。処理順番は後から先(下から上)であることに注意。
 *     MiniCssExtractPlugin.loader: css 情報を外部ファイル化する。
 *     style-loader: css情報を html の style タグに記述。MiniCssExtract との二者択一に負ける。
 *     css-loader: これまでに得た css 情報をまとめて js 内に記述しようとする。そうさせないためにさらに処理を重ねる。
 */
const cssModuleRule = {
  test: /\.(sa|sc|c)ss$/i,
  include: path.resolve(__dirname, 'src/styles'),
  // 下から上へと処理される点に注意
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader"
    // postcss
    // sass
  ],
};


/**
 * webpack 設定の本編部分, module.export オブジェクト。
 * @param {String} outputFile : index.js の出力先でのファイル名, 拡張子抜き。
 * @returns 
 * entry: エントリーポイント設定のオブジェクトを並べる。複数可だが、output設定で[name]を使って設定オブジェクトのキー名を参照させる必要あり。
 * output: 出力先。
 */
module.exports = (outputFile) => ({
  /**
   * 入力設定群: entry:{}
   * エントリーポイント設定のオブジェクト群を羅列する。
   * 複数設定した場合、outputで[name]を使った設定を書く必要あり。
   * src側の対象js/tsファイルをフルパスで指定。キー名とファイル名を合致させるといい。
   */
  entry: {
    index: path.resolve(__dirname, 'src', 'scripts', 'index.js'),
  },

  /**
   * 出力設定 output:{}
   * path: 出力先となるディレクトリのフルパス。dist や public にすることが多いみたい。
   * filename: エントリポイントとなったjsの出力先。[name]を用いて書けば複数エントリに対応可能。この設定の場合、${outputFile}が[name]の文字列を受け取っている。
   * clean: 出力前に、出力ディレクトリ内を空にする。
   */
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `scripts/${outputFile}.js`,
    clean: true
  },

  plugins: [
    miniCssExtractPlugin,
    ...htmlWebpackPlugins
  ],

  module: {
    rules: [
      cssModuleRule,
      htmlLoader,
      assetModuleSetting,
    ],
  },

  /**
   * extensions: ts を使うなら ts を js より先に書く。'...'はデフォルト値('.js','.json','.wasm')なので末尾に書く。
   * alias: 「'キー(=エイリアス文字列)' : それが指すディレクトリのフルパス」という形式でオブジェクトを羅列。
   *  コードを書く時、キー名をエイリアスとして使える。こうしないと、依存関係が正しく解決されない場合があるらしい。
   */
  resolve: {
    extensions: ['.ts', '...'],
    alias: {
      '@css'  : path.resolve(__dirname, './src/styles/'),
      '@js'   : path.resolve(__dirname, './src/scripts/'),
      '@img'  : path.resolve(__dirname, './src/images/'),
      // '@font' : path.resolve(__dirname, './src/font/'),
      // '@ts'   : path.resolve(__dirname, './src/script/'),
      // '@scss' : path.resolve(__dirname, './src/styles/'),
		},
  },
});
