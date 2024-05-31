import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
// import { AppServerModule } from './src/main.server1';

// import clientbootstrap from './src/main'
import { readFileSync } from 'node:fs';
import { renderApplication, renderModule } from '@angular/platform-server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');



  // renderModule
  // **************start 
    // // config
    const FOLDER = join(process.cwd(), 'dist/v18-ssr-demo/browser');
    server.use(express.static(FOLDER));
    // 读取 Angular 应用的 index.html 文件
    const renderHtml = readFileSync(join(FOLDER, 'index.html'), 'utf8');
    // // 处理所有路由
    // server.get('/renderModule', async (req, res) => {
    //     try {
    //         // const html = '<div>ppp</div>'
    //         const renderedHtml = await renderModule(AppServerModule, {
    //         document: renderHtml,
    //         url: req.url
    //         });
    //         res.status(200).send(renderedHtml);
    //     } catch (error) {
    //         console.error('Server-side rendering error:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // });
//****************end */



// renderApplication

// *********************renderApplication start

// 读取 Angular 应用的 index.html 文件
// 处理所有路由
server.get('/renderApplication', async (req, res) => {
    try {
        const renderedHtml = await renderApplication(bootstrap,{
            document: renderHtml,
            url: req.url
          });
          res.status(200).send(renderedHtml);
    } catch (error) {
        console.error('Server-side rendering error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// *********************renderApplication end




  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

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

run();
