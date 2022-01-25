import { Component, OnInit } from '@angular/core';
import { auditTime, audit } from 'rxjs/operators';
import { observable } from 'rxjs';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
})
export class AuditComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log(audit, observable);
  }
}
