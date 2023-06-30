const path = require('path');
module.exports = config = {
    "entry": "./index.js",
    "output": {
        // "filename": "main.[contenthash:6].js",
        "filename": "main.js",
        "path": path.resolve(__dirname, 'dist')
    },
    "cache": {
        "type": "filesystem",
        "cacheDirectory": path.resolve(__dirname, '.cache')
    }
}