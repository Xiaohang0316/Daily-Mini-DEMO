import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, Page1, Page3, Page2 } from './app.component';
import { UIRouterModule } from "@uirouter/angular";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

const Page1State = { name: "Page1", url: "/Page1", component: Page1 };
const Page2State = { name: "Page2", url: "/Page2", component: Page2 };
const Page3State = { name: "Page3", url: "/Page3", component: Page3 };

@NgModule({
  imports: [
    BrowserModule,
    UIRouterModule.forRoot({ states: [Page1State, Page2State, Page3State], useHash: true })
  ],
  declarations: [
    AppComponent,
    Page1, 
    Page2,
    Page3
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  // @ts-ignore
  if (window['ngRef']) {
    // @ts-ignore
    window['ngRef'].destroy();
  }
  // @ts-ignore
  window['ngRef'] = ref;

  // Otherwise, log the boot error
}).catch(err => console.error(err));
