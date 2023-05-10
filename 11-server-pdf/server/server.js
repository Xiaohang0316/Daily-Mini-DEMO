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
