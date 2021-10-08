import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './component/test/test.component';
import { Test1Component } from './component/test1/test1.component';
import { Test2Component } from './component/test2/test2.component';
import { KeyDownbulibuliDirective } from './directive/keyDownbulibuli.directive';
import { FormComponent } from './formTest/form/form.component';
import { ShowTItleHiddenComponent } from './showHiddenDemo/showTItleHidden/showTItleHidden.component';
@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    Test1Component,
    Test2Component,
    KeyDownbulibuliDirective,
    FormComponent,
    ShowTItleHiddenComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
