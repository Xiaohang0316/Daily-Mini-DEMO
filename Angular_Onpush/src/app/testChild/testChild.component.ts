import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-child',
  template: `<div>Test2 <span>{{data.Test2}}</span></div>`,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestChildComponent implements OnInit {
  @Input() data: any;
  ngOnInit():void{
  }
}
