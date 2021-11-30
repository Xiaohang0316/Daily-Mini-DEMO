import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-test',
  template: `
              <div>
                Test1 <span>{{data.Test1}}</span>
              </div>
              <app-test-child  [data]="data"></app-test-child>
              <button  (click)="onClick()">Click</button>
            `
})
export class TestComponent implements OnInit {
  ngOnInit(): void {
  }
  data: any = {
    Test1: 1,
    Test2: 1
  };
  data2:any = {
    Test1: 333,
    Test2: 333
  }
  onClick() {
    ++this.data.Test1;
    ++this.data.Test2;
    // this.data = this.data2
    console.log('Test1',this.data.Test1,'Test2',this.data.Test2);
    
  }
}
