import { Component, OnInit } from '@angular/core';
import { auditTime, audit } from 'rxjs/operators';

@Component({
  selector: 'app-auditTime',
  templateUrl: './auditTime.component.html',
  styleUrls: ['./auditTime.component.css'],
})
export class AuditTimeComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(auditTime);
  }
}
