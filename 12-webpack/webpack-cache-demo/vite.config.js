import path from 'path';
import config from './config';
module.exports = {
    plugins: [],
    build: {
        rollupOptions: {
            input: path.resolve(__dirname, config.entry),
            output: {
                entryFileNames: config.output.filename, // 打包的文件名
                chunkFileNames: "[name].js", // 代码分割后的文件名 
                assetFileNames: "[name][extname]", // 资源文件的文件名
            },
        },
    },
    optimizeDeps: {
        include: ['node_modules']
      }
};