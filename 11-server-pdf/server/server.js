const express = require('express');
const handlebars = require('handlebars');
const fs = require('fs');
const {PDFDocument} = require('pdf-lib')
const templatePath = './server/template.hbs';
var _ = require('lodash');
const templatePathPaging = './server/templatePaging.hbs';
// 创建一个Express应用程序
const app = express();
const port = 3001;

// 生成一个 五列 一百行的数据
const json = [];
for (var i = 0; i < 20; i++) {
  var row = {};
  for (var j = 0; j < 20; j++) {
    var cellKey = 'cloum--' + j;  // cloum
    var cellValue = 'Cell ' + i + '-' + j;  // row
    row[cellKey] = cellValue;
  }
  json.push(row);
}

const data = {
    users: json
}
// 设置路由处理程序
app.get('/api/data', (req, res) => {
    res.json(data);
});
app.get('/api/pdf', async (req, res) => {
    // 读取模板文件
    let html;
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pdfFiles=[];
    const tableData = cutData(data.users);
    console.log('%c [ tableData ]-39', 'font-size:13px; background:pink; color:#bf2c9f;', tableData)
    for (let i = 0; i < tableData.cloumKey.length + 1; i++) {
      fs.readFile(templatePath, 'utf8', (err, template) => {
          if (err) {
              console.error('Error reading template:', err);
              // 处理错误
              return;
          }
          // 编译模板
          const compiledTemplate = handlebars.compile(template);
          // 应用数据到模板
          const pdfData = {
            users: tableData.listData[i],
            cloumKey: tableData.cloumKey[i]
          }
          html = compiledTemplate(pdfData);
      });
      await page.setContent(html);
      var pdfFileName =  'sample'+(i+1)+'.pdf';
      await page.pdf({path: __dirname + pdfFileName,format: 'A4' });
      pdfFiles.push(pdfFileName);
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
    // 关闭浏览器实例
    await browser.close();
    const pdfBytes = await mergePDF(pdfFiles);
    res.send(pdfBytes);

});

// merge PD
const mergePDF = async (sourceFiles) => {
  console.log('%c [ sourceFiles ]-41', 'font-size:13px; background:pink; color:#bf2c9f;', sourceFiles)
  const pdfDoc = await PDFDocument.create()
  for(let i = 0;i<sourceFiles.length;i++) {
    const localPath = __dirname + sourceFiles[i]
    const PDFItem = await PDFDocument.load(fs.readFileSync(localPath))
    for(let j = 0;j<PDFItem.getPageCount();j++) {
      const [PDFPageItem] = await pdfDoc.copyPages(PDFItem, [j])
      pdfDoc.addPage(PDFPageItem)
    }
  }
  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync('samplefina555555l.pdf', pdfBytes)
  return pdfBytes;
}
function cutData(data) {
  const pageSize = 10;
  const listData = [];
  const columKey = Object.keys(data[0]);
  const len = columKey.length;
  const count = Math.ceil(len / pageSize);
  const cloumKey = [];
  for (let i = 0; i < count; i++) {
    const start = i * pageSize;
    const end = start + pageSize;
    const arr = data.slice(start, end);
    for (let j = 0; j < arr.length; j++) {
      arr[j] = _.pick(arr[j], columKey.slice(start, end));
    }
    cloumKey.push(columKey.slice(start, end));
    listData.push(arr);
  }
  return { listData, cloumKey };
}

// 分页 pdf 每页 20 条数据
function cutData1(data) {
      const pageSize = 20;
      const listData = [];
      const len = data.length;
      const count = Math.ceil(len / pageSize);
      const cloumKey = [];
      for (let i = 0; i < count; i++) {
        const start = i * pageSize;
        const end = start + pageSize;
        const arr = data.slice(start, end);
        cloumKey.push(Object.keys(arr[0]))
        listData.push(arr);
      }
      return { listData, cloumKey };
}


// 分页 pdf 每页只显示 10 列
function cutData2(data) {
  const pageSize = 10;
  const listData = [];
  const len = data.length;
  const count = Math.ceil(len / pageSize);
  const cloumKey = [];
  for (let i = 0; i < count; i++) {
    const start = i * pageSize;
    const end = start + pageSize;
    const arr = data.slice(start, end);
    cloumKey.push(Object.keys(arr[0]))
    listData.push(arr);
  }
  return { listData, cloumKey };
}

// 启动服务器
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
