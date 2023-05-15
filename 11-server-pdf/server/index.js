const puppeteer = require('puppeteer');
const fs = require('fs');
const {PDFDocument} = require('pdf-lib')

var pdfUrls = ["http://www.google.com","http://www.yahoo.com"];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  var pdfFiles=[];

  for(var i=0; i<pdfUrls.length; i++){
    await page.goto(pdfUrls[i], {waitUntil: 'networkidle2'});
    var pdfFileName =  'sample'+(i+1)+'.pdf';
    pdfFiles.push(pdfFileName);
    await page.pdf({path: pdfFileName, format: 'A4'});
  }

  await browser.close();

  await mergePDF(pdfFiles);
})();

const mergePDF = async (sourceFiles) => {
  console.log('%c [ sourceFiles ]-41', 'font-size:13px; background:pink; color:#bf2c9f;', sourceFiles)
  const pdfDoc = await PDFDocument.create()
  for(let i = 0;i<sourceFiles.length;i++) {
    const localPath = sourceFiles[i]
    const PDFItem = await PDFDocument.load(fs.readFileSync(localPath))
    for(let j = 0;j<PDFItem.getPageCount();j++) {
      const [PDFPageItem] = await pdfDoc.copyPages(PDFItem, [j])
      pdfDoc.addPage(PDFPageItem)
    }
  }
  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync('samplefinal.pdf', pdfBytes)

}
