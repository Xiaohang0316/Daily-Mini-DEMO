import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import { provideServerRendering, renderApplication, renderModule } from '@angular/platform-server';
import { readFileSync } from 'fs';
import { AppModule } from './src/app/app.module'; // 替换为你的应用模块的路径
import { ApplicationRef } from '@angular/core';


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/angular-ssr-demo/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';




// config
  const FOLDER = join(process.cwd(), 'dist/angular-ssr-demo/browser');
  server.use(express.static(FOLDER));
  // 读取 Angular 应用的 index.html 文件
  const renderHtml = readFileSync(join(FOLDER, 'index.html'), 'utf8');
// renderModule
// **************start 
    // 处理所有路由
    server.get('/renderModule', async (req, res) => {
        try {
            // const html = '<div>ppp</div>'
            const renderedHtml = await renderModule(AppServerModule, {
            document: renderHtml,
            url: req.url,
            });
            res.status(200).send(renderedHtml);
        } catch (error) {
            console.error('Server-side rendering error:', error);
            res.status(500).send('Internal Server Error');
        }
    });
//****************end */




// renderApplication

// *********************renderApplication start

// 读取 Angular 应用的 index.html 文件
// 处理所有路由
// server.get('/renderApplication', async (req, res) => {
//     try {
//         const renderedHtml = await renderApplication(AppServerModule,{
//             document: renderHtml,
//             url: req.url
//           });
//           res.status(200).send(renderedHtml);
//     } catch (error) {
//         console.error('Server-side rendering error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// *********************renderApplication end



// provideServerRendering
// ************************provideServerRendering start 
// 读取 Angular 应用的 index.html 文件
// 处理所有路由

// server.get('/renderModule', async (req, res) => {
//     try {
//         // const html = '<div>ppp</div>'
//         const renderedHtml = await renderModule(AppServerModule, {
//             document: renderHtml,
//             url: req.url,
//             providers: [provideServerRendering()]
//         });
//         res.status(200).send(renderedHtml);
//     } catch (error) {
//         console.error('Server-side rendering error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });



// ************************provideServerRendering end





  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
//   server.engine('html', ngExpressEngine({
//     bootstrap: AppServerModule
//   }));

//   server.set('view engine', 'html');
//   server.set('views', distFolder);

//   // Example Express Rest API endpoints
//   // server.get('/api/**', (req, res) => { });
//   // Serve static files from /browser
//   server.get('*.*', express.static(distFolder, {
//     maxAge: '1y'
//   }));

//   // All regular routes use the Universal engine
//   server.get('*', (req, res) => {
//     res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
//   });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';



// // 引入必要的模块
// import 'zone.js/dist/zone-node';
// import { enableProdMode } from '@angular/core';
// import { renderModule } from '@angular/platform-server';
// import * as express from 'express';
// import { readFileSync } from 'fs';
// import { join } from 'path';

// // 加载服务器端渲染的 Angular 应用模块
// // import { AppServerModule } from './src/app/app.server.module'; // 替换为你的应用模块的路径
// import { AppServerModule } from './src/main.server';
// export * from './src/main.server';


// // 启用 Angular 生产模式
// enableProdMode();

// // 创建 Express 应用
// const app = express();

// // 定义静态资源路径
// const DIST_FOLDER = join(process.cwd(), 'dist/browser');
// app.use(express.static(DIST_FOLDER));

// // 读取 Angular 应用的 index.html 文件
// const indexHtml = readFileSync(join(DIST_FOLDER, 'index.html'), 'utf8');

// // 处理所有路由
// app.get('*', async (req, res) => {
//   try {
//     const renderedHtml = await renderModule(AppServerModule, {
//       document: indexHtml,
//       url: req.url,
//     });
//     // 将渲染后的 HTML 发送给客户端
//     res.status(200).send(renderedHtml);
//   } catch (error) {
//     console.error('Server-side rendering error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // 启动 Express 服务器
// const PORT = process.env['PORT'] || 4000;
// app.listen(PORT, () => {
//   console.log(`Node Express server listening on http://localhost:${PORT}`);
// });
