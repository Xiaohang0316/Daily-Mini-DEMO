import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'uiRouterDemo';
}

@Component({
  template: "<h3>Page-1</h3>"
})
export class Page1 {}

@Component({
  template: "<h3>Page-2</h3>"
})
export class Page2 {}

@Component({
  template: "<h3>Page-3</h3>"
})
export class Page3 {}

