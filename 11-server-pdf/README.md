### Angular PDf server 端渲染
#### 1. 环境准备 
``` bash 
     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
Angular CLI: 16.0.0
Node: 16.14.0
Package Manager: npm 8.3.1
OS: darwin arm64
Angular: 
Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1600.0 (cli-only)
@angular-devkit/core         16.0.0 (cli-only)
@angular-devkit/schematics   16.0.0 (cli-only)
@schematics/angular          16.0.0 (cli-only)


"express": "^4.18.2",
"handlebars": "^4.7.7",
"puppeteer": "^20.1.2",
```

#### 2. 新建一个  angular 项目并在项目下启动一个 express 服务，用于数据的获取和 PDF 的渲染导出

  1. 创建一个新项目 
     ```bash 
     ng new server-pdf
     ```

2. 修改 `app.component.html` 和 `app.component.ts`

   添加一个 到处按钮， 导出当前在后端获取回来的list

   `app.component.html`
   
   ```ts
   <div>
       <h1>angular PDF server 渲染</h1>
       <button (click)="downloadPdf()"> Export to PDF</button>
       <div class="line">
       </div>
       <table id="list">
           <thead>
               <tr>
                   <th>名字</th>
                   <th>性别</th>
                   <th>年龄</th>
               </tr>
           </thead>
           <tbody>
               <tr *ngFor="let item of data">
                   <td>{{ item.name }}</td>
                   <td>{{ item.gender }}</td>
                   <td>{{ item.age }}</td>
               </tr>
           </tbody>
       </table>
   </div>
   ```

   `app.component.ts`
   
   init 时，从后端获取数据，并渲染到页面
   
   ```ts
   import { Component, OnInit } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   @Component({
       selector: 'app-root',
       templateUrl: './app.component.html',
       styleUrls: ['./app.component.less']
   })
   export class AppComponent implements OnInit {
       data: {
           name: string;
           age: string;
           gender: string;
       }[] = []
       constructor(private http: HttpClient) { }
       ngOnInit() {
           this.getData();
       }
       getData(): void {
           this.http.get('/api/data').subscribe((data: any) => {
               this.data = data.users;
           });
       }
       downloadPdf(): void {
           this.http.get('/api/pdf', {
             responseType: 'blob'
           }).subscribe((pdfBlob: Blob) => {
             const pdfUrl = URL.createObjectURL(pdfBlob);
             const downloadLink = document.createElement('a');
             downloadLink.href = pdfUrl;
             downloadLink.download = 'angular-pdf.pdf';
             downloadLink.click();
           });
         }
   }
   ```
   
3. 在项目的根目录下 创建 `server`文件夹
	1. 创建 `template.hbs` template  
   
      创建要转换为 PDF 的 HTML 元素
   
        ```ts
        <div>
            <h1>angular PDF server 渲染</h1>
            <table id="list">
                <thead>
                    <tr>
                        <th>名字</th>
                        <th>性别</th>
                        <th>年龄</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each users}}
                    <tr>
                        <td>{{ name }}</td>
                        <td>{{ gender }}</td>
                        <td>{{ age }}</td>
                    </tr>
                    {{/each}}
                </tbody>
            </table>
        </div>
      ```
   2. 创建 `server.js`

      当前端在请求`/api/pdf` 这个接口时，后端拿到当前页面渲染的数据，使用 `handlebars` 定义的 template 将数据转换为 HTML 格式，然后再使用 `puppeteer` 创建一个无头浏览器，创建空白页，将 `handlebars` 创建的 HTML 放进 浏览器中转换为 PDF 以`Buffer` 的格式传输给前端，传输完毕关闭 虚拟浏览器
   
      导入 `handlebars` `express` `fs` 和创建好的 handlebars template
   
      ```ts
      const express = require('express');
      const handlebars = require('handlebars');
      const fs = require('fs');
      const templatePath = './server/template.hbs';
      // 创建一个Express应用程序
      const app = express();
      const port = 3000;
      const data = {
          users: [
              {
                  name: '张三',
                  age: '18',
                  gender: '男'
              },
              {
                  name: '李四',
                  age: '19',
                  gender: '男'
              },
              {
                  name: '王五',
                  age: '20',
                  gender: '女'
              }
          ]
      }
      // 设置路由处理程序
      app.get('/api/data', (req, res) => {
          res.json(data);
      });
      app.get('/api/pdf', async (req, res) => {
          // 读取模板文件
          let html;
          fs.readFile(templatePath, 'utf8', (err, template) => {
              if (err) {
                  console.error('Error reading template:', err);
                  // 处理错误
                  return;
              }
              // 编译模板
              const compiledTemplate = handlebars.compile(template);
              // 应用数据到模板
              html = compiledTemplate(data);
          });
          const puppeteer = require('puppeteer');
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setContent(html);
          const pdfBuffer = await page.pdf({ format: 'A4' });
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
          res.send(pdfBuffer);
          // 关闭浏览器实例
          await browser.close();
      });
      // 启动服务器
      app.listen(port, () => {
          console.log(`Server listening on port ${port}`);
      });
      ```
   
   
   
   3. 创建 `proxy.conf.json` 将前端的请求都转发到 server.js 中
   
   ```ts
   {
    "/api/*": {
      "target": "http://localhost:3000",
      "secure": false,
      "logLevel": "debug"
    }
   }
   ```

以上就是angular PDF server 渲染完整流程



