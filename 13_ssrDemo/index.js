const fs = require('fs')


fetch('http://localhost:4200')
  .then(response => response.text())
  .then(html => {
    // 使用 fs 将获取到的内容保存到本地便于比对
    fs.writeFileSync(`${__dirname}/CSR.html`, html);
    console.log('HTML:', html);
  })
  .catch(error => {
    console.error('Error fetching the page:', error);
  });

    







