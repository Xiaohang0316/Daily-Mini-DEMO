import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
})
export class FormComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  btn1() {
    alert('submit');
  }
  btn2() {
    console.log('[ Submit ]');
  }
  btn3() {
    console.log('[ Submit ]');
  }
  btn4() {
    console.log('[ Submit ]');
  }
}
