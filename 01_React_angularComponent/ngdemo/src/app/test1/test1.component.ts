import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.less']
})
export class Test1Component implements OnInit {

  constructor() { }
  // angular 使用@Input @Output进行传参进行组件之间传参

  @Input() date!: any;

  @Output() testoutput = new EventEmitter<string>();
  testclick() {
    this.testoutput.emit('11111111')
  }

  // 相当于ngOnChange   检测数据变化
  @Input()
  get name(): string { return this._name; }
  set name(name: string) {
    this._name = name;
  }
  private _name: string = ''
  ngOnInit(): void {
  }

}
