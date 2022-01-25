import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuditComponent } from './audit/audit.component';
import { AuditTimeComponent } from './auditTime/auditTime.component';
import { TakeComponent } from './take/take.component';
import { TakeUntilComponent } from './takeUntil/takeUntil.component';

@NgModule({
  declarations: [				
    AppComponent,
      AuditComponent,
      AuditTimeComponent,
      TakeComponent,
      TakeUntilComponent
   ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
