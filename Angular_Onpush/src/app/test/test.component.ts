import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-test',
  template: `
              <div>
                Test1 <span>{{data.Test1}}</span>
              </div>

              <app-test-child  [data]="data"></app-test-child>

              <button  (click)="onClick()">Click</button>
            `,
  styles:['*{ margin-top: 30px;}'],
})
export class TestComponent implements OnInit {
  ngOnInit(): void {
  }
  data: any = {
    Test1: 1,
    Test2: 1
  };
  onClick() {
    ++this.data.Test1;
    ++this.data.Test2;
    console.log('Test1',this.data.Test1,'Test2',this.data.Test2);
    
  }
}
