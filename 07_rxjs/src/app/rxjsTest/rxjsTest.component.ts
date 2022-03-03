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
   range(1,3000)
      .pipe(v=>interval(1000))
      .pipe(audit(v=>interval(3000)))
      .subscribe(x=>console.log(new Date(), x))
    //---------------------------------------------------------------------------------------------
    // auditTime;
    // range(1,3000)
    //   .pipe(v=>interval(1000))
    //   .pipe(auditTime(3000))
    //   .subscribe(x=>console.log(new Date(), x))

  }

}
