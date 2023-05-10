#### 1.angular 服务端渲染 (Angular Universal https://angular.io/guide/universal)
Angular框架提供了Angular Universal来实现服务端渲染（Server-Side Rendering，简称SSR）的功能。Angular Universal允许在服务器端渲染Angular应用程序，并将完整的渲染好的HTML页面发送给客户端。
#### 2.angular 服务端渲染PDF 
##### 1. 创建一个 ssr 项目
 1. 设置服务器端环境：确保你的服务器能够运行Angular应用。这意味着你需要有Node.js和npm安装在服务器上。确保你的服务器上已经安装了所需的版本。

    ```bash
        / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
       / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
      / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
     /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                    |___/
    Angular CLI: 16.0.0
    Node: 16.14.0
    Package Manager: npm 8.3.1
    OS: win32 x64
    Angular:
    Package                      Version
    @angular-devkit/architect    0.1600.0 (cli-only)
    @angular-devkit/core         16.0.0 (cli-only)
    @angular-devkit/schematics   16.0.0 (cli-only)
    @schematics/angular          16.0.0 (cli-only)
    ```

    

 2. 创建Angular应用：使用Angular CLI在你的服务器上创建一个新的Angular应用。在命令行中执行以下命令：

    ```bash
    ng new ssr-demo
    ```

3. 安装服务器端渲染（Angular Universal）：Angular Universal是Angular官方提供的用于服务器端渲染的解决方案。Angular Universal 需要活跃 LTS 或 维护中 LTS版本的 Node.js，
在Angular应用目录下，执行以下命令安装Angular Universal：
   
    ```bash 
    # 这将为应用添加所需的服务器端渲染功能。
    ng add @nguniversal/express-engine
    ```

​		在执行 `ng add @nguniversal/express-engine` 后，Angular Universal会为你的应用创建一些文件和目录，其中包括用于服务器端渲染的代码。

```bash
    Option "appId" is deprecated: This option is no longer used.
    CREATE src/main.server.ts (60 bytes)
    CREATE src/app/app.server.module.ts (318 bytes)
    CREATE tsconfig.server.json (272 bytes)
    CREATE server.ts (2030 bytes)
    UPDATE package.json (1446 bytes)
    UPDATE angular.json (4528 bytes)
    UPDATE src/app/app-routing.module.ts (291 bytes)
    ✔ Packages installed successfully.
```

此时执行 `npm run dev:ssr` 将刚才的项目跑起来，打开浏览器的 Network 有一个 localhost 的请求 ，点看可以看到一个简单的 angular ssr 项目已经算是搭建完成 

![image-20230510102937396](./image-20230510102937396.png)

##### 2. 将当前页面使用后端渲染导出为 PDF

1. 使用  `puppeteer` 插件对页面进行处理并转化为 PDF   （https://www.npmjs.com/package/puppeteer）

```bash
npm install puppeteer
```



2. 生成PDF：在服务器端创建一个路由处理程序，该处理程序将渲染你的Angular组件并生成PDF。

   在原有的 server.ts 的基础上 添加 `puppeteer` 插件，并新增路由做 PDF 渲染导出
   
   `server.ts`

   ```diff
      import 'zone.js/node';
   
      import { APP_BASE_HREF } from '@angular/common';
      import { ngExpressEngine } from '@nguniversal/express-engine';
      import * as express from 'express';
      import { existsSync } from 'node:fs';
      import { join } from 'node:path';
      import { AppServerModule } from './src/main.server';
   
      // The Express app is exported so that it can be used by serverless Functions.
      export function app(): express.Express {
        const server = express();
        const distFolder = join(process.cwd(), 'dist/ssr-demo/browser');
        const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
      
        // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
        server.engine('html', ngExpressEngine({
          bootstrap: AppServerModule
        }));
      
        server.set('view engine', 'html');
        server.set('views', distFolder);
      
        // Example Express Rest API endpoints
        // Serve static files from /browser
        server.get('*.*', express.static(distFolder, {
          maxAge: '1y'
        }));
        
   +   server.get('/pdf', async (req,res) => {
   +       const puppeteer = require('puppeteer');
   +       // 创建一个无头浏览器
   +       const browser = await puppeteer.launch({ headless: true });
   +       // 创建一个空白页面
   +       const page = await browser.newPage();
   +       // 跳转到当前页面
   +       await page.goto(req.query['url']);
   +       // await page.setContent('<h1>Hello, World!</h1>');
   +       // 将当前页面生成PDF
   +       const pdfBuffer = await page.pdf({ format: 'A4' });
   +       res.setHeader('Content-Type', 'application/pdf');
   +       res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
   +       res.send(pdfBuffer);
   +       // 关闭浏览器实例
   +       await browser.close();
   +    })
   
        // All regular routes use the Universal engine
        server.get('*', (req, res) => {
          res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
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
   ```
   在 `app.component.html` 中添加一个按钮，并调用 downloadPDF 方法
   ```ts
   <button (click)="download()">download PDF</button>
   // 点击按钮调用 download 方法，并下载 server.ts 返回的 PDF 文件。
   ```
   `app.component.ts`
   
   ```diff
     import { Component } from '@angular/core';
   + import { HttpClient } from '@angular/common/http';
     @Component({
       selector: 'app-root',
       templateUrl: './app.component.html',
       styleUrls: ['./app.component.less']
     })
     export class AppComponent {
       title = 'ssr-demo';
   +   constructor(private http: HttpClient) { }
   +   download(): void {
   +     this.http.get('/pdf', {
   +       responseType: 'blob',
   +       params: {
   +         url: window.location.href
   +       },
   +     }).subscribe((pdfBlob: Blob) => {
   +       const pdfUrl = URL.createObjectURL(pdfBlob);
   +       const downloadLink = document.createElement('a');
   +       downloadLink.href = pdfUrl;
   +       downloadLink.download = 'angular-pdf.pdf';
   +       downloadLink.click();
   +     });
   +   }
     }
   
   ```
   
   



我们创建了一个名为`/pdf`的路由处理程序，它将渲染Angular组件为HTML字符串，然后使用`puppeteer`库将其加载到一个虚拟的浏览器页面中，并生成PDF。最后，将生成的PDF作为响应发送给客户端。

在服务器上执行上述代码后，可以通过访问接口`/pdf`来生成并下载生成的PDF文件。确保你的Angular应用已在服务器上构建并部署到`dist`目录下。


