import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { take, takeUntil, audit, auditTime } from 'rxjs/operators';
import { from, fromEvent, interval, range } from 'rxjs';

@Component({
  selector: 'app-rxjsTest',
  templateUrl: './rxjsTest.component.html',
  styleUrls: ['./rxjsTest.component.css'],
})
export class RxjsTestComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    //take
    // range(1, 10).subscribe(console.log);
    // console.log('-------------------');
    // range(1, 10).pipe(take(5)).subscribe(console.log);
    //---------------------------------------------------------------------------------------------
    //takeUntil
    // fromEvent(document, 'mousemove')
    //   .pipe(takeUntil(fromEvent(document, 'click')))
    //   .subscribe(console.log);
    //---------------------------------------------------------------------------------------------
    //audit
    fromEvent(document, 'mousemove')
      .pipe(audit((ev) => interval(1000)))
      .subscribe((x) => console.log(new Date(), x));
    //---------------------------------------------------------------------------------------------
    // auditTime;
    // fromEvent(document, 'mousemove')
    //   .pipe(auditTime(2000))
    //   .subscribe((x) => console.log(new Date(), x));
  }
}
