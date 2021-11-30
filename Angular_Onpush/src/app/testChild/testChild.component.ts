import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-child',
  template: `<div (click)="onClick()">Test2 <span>{{data.Test2}}</span></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestChildComponent implements OnInit {
  @Input() data: any;
  constructor(private cdr: ChangeDetectorRef) {
    setTimeout(() => {
      this.data.Test2 = 9;
      this.cdr.detectChanges();
    }, 1000);
  }
  ngOnInit():void{ }
  onClick() {
    ++this.data.Test2;
  }
}
