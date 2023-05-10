import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ssr-demo';
  constructor(private http: HttpClient) { }

  download(): void {
    this.http.get('/pdf', {
      responseType: 'blob',
      params: {
        url: window.location.href
      },
    }).subscribe((pdfBlob: Blob) => {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = 'angular-pdf.pdf';
      downloadLink.click();
    });
  }
}
