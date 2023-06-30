const path = require('path');

module.exports = {
  mode: "development",
  entry: './index.js',
  output: {
    // 可以使用 [contenthash] 或 [chunkhash] 来生成文件的哈希，确保文件内容发生变化时哈希值也会发生变化。
    filename: 'main.[contenthash:6].js',
    path: path.resolve(__dirname, 'dist'),
  },
  cache: {
    type: 'filesystem', 
    cacheDirectory: path.resolve(__dirname, 'cache'),
  },
};
