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
