# plain-web-design-webpack-template

## 何をするためのものか
- ウェブサイトのコーディングのために　webpack 環境を簡単に用意するためのもの。
- とりわけ、生の css と js を用いる簡単なウェブサイトを想定した簡単な環境を作る。
- ファイルのツリー構造が合致すれば、外部であるていど作りこんだウェブサイトのプロジェクトを持ち込み、バンドルとミニファイを施すために使う事もできると思う。


## 使い方

### 1 環境設定

```bash
echo '18' > .nvmrc
nvm install
npm init -y
npm i -D webpack webpack-cli webpack-merge terser-webpack-plugin css-loader mini-css-extract-plugin css-minimizer-webpack-plugin html-webpack-plugin html-loader
```

### 2 プロジェクトを src dir 内に配置, または作成

```
website-project-dir
  |_images/
  |   |_*.imgs or sub dirs refered other files.
  |_styles/
  |   |_index.css
  |   |_any other sub dirs or css files.
  |_scripts/
  |   |_index.js
  |   |_any other sub dirs or js files.
  |_index.html
  |_any other html files
```
1. 上記のような構造のプレーンなウェブサイトを、src ディレクトリ直下に配置。
2. index.js の冒頭に、必要な import 文(特に `import '../styles/index,css` )を記述。
3. `npm run pro` する。
4. 依存関係が悪いなら、ソースコード内のファイル参照パスを、エイリアスを使う記述に変えてみたり。

---

## 前口上

*It's describes the procedures for establishing the development environment for this project, at 23th Nov. '22.  
For simple web production using html, css and javascript, this configuration can be reused.*

## 1. some preprocessing

### 1-1. Make 'hoge.code-workspace'.

#### console

```bash
touch hoge.code-workspace
```

Reopen hoge.code-workspace.

#### Input next json to hoge.code-workspace

```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "editor.insertSpaces": true,
    "editor.tabSize": 2,
    "files.exclude": {
      "**/.git": true,
      "**/node_modules/": true,
      "**/package-lock.json": true,
      "**/.nvmrc": true,
    }
  }
}
```

### 1-2. Make directories and files

#### console
```bash
mkdir -pv ./src/{htmls,styles,scripts,images}
touch ./src/{htmls/index.html,styles/index.css,scripts/index.js}
touch ./{webpack.common.js,webpack.dev.js,webpack.prod.js}
```

#### mkdir's options
```
-p, --parents     no error if existing, make parent directories as needed
-v, --verbose     print a message for each created directory
```

### 1-3 Git setting

*Prerequisite:  
New remote-repository on Github.  
The path like 'git@github.com:accountName/repositoryName.git', not 'https~', to the clipboard.*

#### console
```bash
git init
git add -A
git commit -m 'first commit'
git branch -M main
git remote add origin git@github.com:keijiek/reskilling-website.git
git push -u origin main
```
---

## 2. Node modules installation

*Prerequisite:  
[nvm](https://github.com/nvm-sh/nvm) installation (see [nvm > Install & Update Script](https://github.com/nvm-sh/nvm#install--update-script))  
...or any other versio-managing tool for Node.*

### Node installation by nvm

#### console

```bash
echo '18' > .nvmrc
nvm install
```

### Make package.json, Install node_modules.

#### full
```bash
npm init -y
npm i -D webpack webpack-cli webpack-merge terser-webpack-plugin css-loader mini-css-extract-plugin css-minimizer-webpack-plugin html-webpack-plugin html-loader 
```

#### separated
```bash
npm init -y
npm i -D webpack webpack-cli webpack-merge
npm i -D css-loader mini-css-extract-plugin css-minimizer-webpack-plugin
npm i -D html-webpack-plugin html-loader terser-webpack-plugin
```

---

## 3. Webpack

### webpack.*.js

#### webpack.common.js
```js
const path = require('path');

```

---

## 4. Actions of after 'git init'ing.

### 1 ...or create a new repository on the command line

```bash
# echo "# reskilling-website" >> README.md
# git add README.md
git init
git add -A
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:keijiek/reskilling-website.git
git push -u origin main
```

### 2 ...or push an existing repository from the command line

```bash
git remote add origin git@github.com:keijiek/reskilling-website.git
git branch -M main
git push -u origin main
```

### 3 ...or import code from another repository

You can initialize this repository with code from a Subversion, Mercurial, or TFS project.  
[import_code](https://github.com/keijiek/reskilling-website/import)
