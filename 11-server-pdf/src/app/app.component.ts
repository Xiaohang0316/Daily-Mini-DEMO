import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})


export class AppComponent implements OnInit {
    data: any = []

    constructor(private http: HttpClient) { }
    titleList: any = []
    log = console.log;
    ngOnInit() {
        this.getData();
    }
    getData(): void {
        this.http.get('/api/data').subscribe((data: any) => {
            // this.data = data.users;
            // this.titleList = Object.keys(this.data[0])
            this.data = this.cutData(data.users);
        });
    }
    // 写一个切数据的方法，将一个 50* 50的数据切成 十个 10 * 50的数据
    // colum 数据分割
    cutData(data: any) {
      const pageSize = 10;
      const result: any = [];
      const columKey = Object.keys(data[0]);
      const len = columKey.length;
      const count = Math.ceil(len / pageSize);
      for (let i = 0; i < count; i++) {
        const start = i * pageSize;
        const end = start + pageSize;
        const arr = data.slice(start, end);
        for (let j = 0; j < arr.length; j++) {
          arr[j] = _.pick(arr[j], columKey.slice(start, end));
        }
        this.titleList.push(columKey.slice(start, end));
        result.push(arr);
      }
      return result;
    }

   // 写一个方法，将一个 50 * 50 的数据切成 5 个 50 * 10 的数据




    // row 数据分割
    cutData1(data: any) {
      const pageSize = 10;
      const result: any = [];
      const len = data.length;
      const count = Math.ceil(len / pageSize);
      for (let i = 0; i < count; i++) {
        const start = i * pageSize;
        const end = start + pageSize;
        const arr: any = data.slice(start, end);
        this.titleList.push(Object.keys(arr[0]))
        result.push(arr);
      }
      return result;
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

    getcloumName(index: any, item: any) {
        return item[`cloum--${index}`]
    }
}
