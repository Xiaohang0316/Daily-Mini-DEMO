import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-takeUntil',
  templateUrl: './takeUntil.component.html',
  styleUrls: ['./takeUntil.component.css'],
})
export class TakeUntilComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(takeUntil);
  }
}
