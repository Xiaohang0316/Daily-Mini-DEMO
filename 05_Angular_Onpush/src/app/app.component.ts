import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  
  <div>
      <div>Kenko</div>


      <div>Angular ChangeDetectionStrategy.OnPush</div>

      <div>
        <app-test></app-test>
      </div>
  
    </div>
  
  `,
  styles:['*{ margin-top: 30px;}'],
})
export class AppComponent {
  title = 'onpush';
}
