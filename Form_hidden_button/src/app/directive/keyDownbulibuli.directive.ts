import { Directive, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import * as _ from 'lodash';
@Directive({
  selector: '[appKeyDownbulibuli]',
})
export class KeyDownbulibuliDirective {
  private subscriptSet: Subscription[] = [];
  constructor(el: ElementRef) {
    console.log('[ 1111111 ]');
    // this.subscriptSet.push(
    fromEvent(el.nativeElement, 'click').subscribe(this.keyDowmbuli);
    // );
  }
  keyDowmbuli(event: any) {
    // console.dir(event.target.attributes);
    // _.set(event, 'target.attributes', 'id="maskEdit"');
    // event.target.attributes['data-show'] = true;
    console.dir(event.target.attributes.showHidden);
    console.log('%c [ event.target ]', 'font-size:13px; background:pink; color:#bf2c9f;', event.target)
    if (event.target.attributes.showHidden) {
      _.set(
        document.getElementsByClassName('qweasd')[0],
        'style.display',
        'block'
      );
    } else {
      _.set(
        document.getElementsByClassName('qweasd')[0],
        'style.display',
        'none'
      );
    }
    console.dir(event.target.attributes);
    // console.dir(event.target.attributes);
  }
}
