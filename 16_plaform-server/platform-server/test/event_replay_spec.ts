/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {Component, destroyPlatform, getPlatform, Type} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {
  withEventReplay,
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';

import {provideServerRendering} from '../public_api';
import {EVENT_DISPATCH_SCRIPT_ID, renderApplication} from '../src/utils';

import {getAppContents, hydrate, render as renderHtml, resetTViewsFor} from './dom_utils';

/**
 * Represents the <script> tag added by the build process to inject
 * event dispatch (JSAction) logic.
 */
const EVENT_DISPATCH_SCRIPT = `<script type="text/javascript" id="${EVENT_DISPATCH_SCRIPT_ID}"></script>`;
const DEFAULT_DOCUMENT = `<html><head></head><body>${EVENT_DISPATCH_SCRIPT}<app></app></body></html>`;

/** Checks whether event dispatch script is present in the generated HTML */
function hasEventDispatchScript(content: string) {
  return content.includes(EVENT_DISPATCH_SCRIPT_ID);
}

/** Checks whether there are any `jsaction` attributes present in the generated HTML */
function hasJSActionAttrs(content: string) {
  return content.includes('jsaction="');
}

describe('event replay', () => {
  let doc: Document;
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;

  beforeAll(async () => {
    globalThis.window = globalThis as unknown as Window & typeof globalThis;
    await import('@angular/core/primitives/event-dispatch/contract_bundle_min.js' as string);
  });

  beforeEach(() => {
    if (getPlatform()) destroyPlatform();
    doc = TestBed.inject(DOCUMENT);
  });

  afterAll(() => {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    destroyPlatform();
  });

  afterEach(() => {
    doc.body.textContent = '';
  });

  /**
   * This renders the application with server side rendering logic.
   *
   * @param component the test component to be rendered
   * @param doc the document
   * @param envProviders the environment providers
   * @returns a promise containing the server rendered app as a string
   */
  async function ssr(
    component: Type<unknown>,
    options: {doc?: string; enableEventReplay?: boolean; hydrationDisabled?: boolean} = {},
  ): Promise<string> {
    const {enableEventReplay = true, hydrationDisabled, doc = DEFAULT_DOCUMENT} = options;

    const hydrationProviders = hydrationDisabled
      ? []
      : enableEventReplay
        ? provideClientHydration(withEventReplay())
        : provideClientHydration();

    const bootstrap = () =>
      bootstrapApplication(component, {
        providers: [provideServerRendering(), hydrationProviders],
      });

    return renderApplication(bootstrap, {
      document: doc,
    });
  }

  function render(doc: Document, html: string) {
    renderHtml(doc, html);
    globalThis.document = doc;
    const scripts = doc.getElementsByTagName('script');
    for (const script of Array.from(scripts)) {
      if (script?.textContent?.startsWith('window.__jsaction_bootstrap')) {
        eval(script.textContent);
      }
    }
  }

  it('should route to the appropriate component with content projection', async () => {
    const outerOnClickSpy = jasmine.createSpy();
    const innerOnClickSpy = jasmine.createSpy();
    @Component({
      selector: 'app-card',
      standalone: true,
      template: `
        <div class="card">
          <button id="inner-button" (click)="onClick()"></button>
          <ng-content></ng-content> 
        </div>
      `,
    })
    class CardComponent {
      onClick = innerOnClickSpy;
    }

    @Component({
      selector: 'app',
      imports: [CardComponent],
      standalone: true,
      template: `
        <app-card>
          <h2>Card Title</h2>
          <p>This is some card content.</p>
          <button id="outer-button" (click)="onClick()">Click Me</button>
        </app-card>
      `,
    })
    class AppComponent {
      onClick = outerOnClickSpy;
    }
    const html = await ssr(AppComponent);
    const ssrContents = getAppContents(html);
    render(doc, ssrContents);
    resetTViewsFor(AppComponent);
    const outer = doc.getElementById('outer-button')!;
    const inner = doc.getElementById('inner-button')!;
    outer.click();
    inner.click();
    const appRef = await hydrate(doc, AppComponent, {
      hydrationFeatures: [withEventReplay()],
    });
    appRef.tick();
    expect(outerOnClickSpy).toHaveBeenCalledBefore(innerOnClickSpy);
  });

  it('should serialize event types to be listened to and jsaction attribute', async () => {
    const clickSpy = jasmine.createSpy('onClick');
    const focusSpy = jasmine.createSpy('onFocus');
    @Component({
      standalone: true,
      selector: 'app',
      template: `
            <div (click)="onClick()" id="click-element">
              <div id="focus-container">
                <div id="focus-action-element" (focus)="onFocus()">
                  <button id="focus-target-element">Focus Button</button>
                </div>
              </div>
            </div>
          `,
    })
    class SimpleComponent {
      onClick = clickSpy;
      onFocus = focusSpy;
    }
    const html = await ssr(SimpleComponent);
    const ssrContents = getAppContents(html);

    render(doc, ssrContents);
    const el = doc.getElementById('click-element')!;
    const button = doc.getElementById('focus-target-element')!;
    const clickEvent = new CustomEvent('click', {bubbles: true});
    el.dispatchEvent(clickEvent);
    const focusEvent = new CustomEvent('focus');
    button.dispatchEvent(focusEvent);
    expect(clickSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
    resetTViewsFor(SimpleComponent);
    const appRef = await hydrate(doc, SimpleComponent, {
      hydrationFeatures: [withEventReplay()],
    });
    appRef.tick();
    expect(clickSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should remove jsaction attributes, but continue listening to events.', async () => {
    @Component({
      standalone: true,
      selector: 'app',
      template: `
            <div (click)="onClick()" id="1">
              <div (click)="onClick()" id="2"></div>
            </div>
          `,
    })
    class SimpleComponent {
      onClick() {}
    }

    const docContents = `<html><head></head><body>${EVENT_DISPATCH_SCRIPT}<app></app></body></html>`;
    const html = await ssr(SimpleComponent, {doc: docContents});
    const ssrContents = getAppContents(html);
    render(doc, ssrContents);
    const el = doc.getElementById('1')!;
    expect(el.hasAttribute('jsaction')).toBeTrue();
    expect((el.firstChild as Element).hasAttribute('jsaction')).toBeTrue();
    resetTViewsFor(SimpleComponent);
    const appRef = await hydrate(doc, SimpleComponent, {
      hydrationFeatures: [withEventReplay()],
    });
    appRef.tick();
    expect(el.hasAttribute('jsaction')).toBeFalse();
    expect((el.firstChild as Element).hasAttribute('jsaction')).toBeFalse();
  });

  it(`should add 'nonce' attribute to event record script when 'ngCspNonce' is provided`, async () => {
    @Component({
      standalone: true,
      selector: 'app',
      template: `
            <div (click)="onClick()">
                <div (blur)="onClick()"></div>
            </div>
          `,
    })
    class SimpleComponent {
      onClick() {}
    }

    const doc =
      `<html><head></head><body>${EVENT_DISPATCH_SCRIPT}` +
      `<app ngCspNonce="{{nonce}}"></app></body></html>`;
    const html = await ssr(SimpleComponent, {doc});
    expect(getAppContents(html)).toContain('<script nonce="{{nonce}}">window.__jsaction_bootstrap');
  });

  describe('bubbling behavior', () => {
    it('should propagate events', async () => {
      const onClickSpy = jasmine.createSpy();
      @Component({
        standalone: true,
        selector: 'app',
        template: `
            <div id="top" (click)="onClick()">
                <div id="bottom" (click)="onClick()"></div>
            </div>
          `,
      })
      class SimpleComponent {
        onClick = onClickSpy;
      }
      const docContents = `<html><head></head><body>${EVENT_DISPATCH_SCRIPT}<app></app></body></html>`;
      const html = await ssr(SimpleComponent, {doc: docContents});
      const ssrContents = getAppContents(html);
      render(doc, ssrContents);
      resetTViewsFor(SimpleComponent);
      const bottomEl = doc.getElementById('bottom')!;
      bottomEl.click();
      const appRef = await hydrate(doc, SimpleComponent, {
        hydrationFeatures: [withEventReplay()],
      });
      appRef.tick();
      // This is a bug
      expect(onClickSpy).toHaveBeenCalledTimes(1);
      onClickSpy.calls.reset();
      bottomEl.click();
      expect(onClickSpy).toHaveBeenCalledTimes(2);
    });

    it('should not propagate events if stopPropagation is called', async () => {
      @Component({
        standalone: true,
        selector: 'app',
        template: `
            <div id="top" (click)="onClick($event)">
                <div id="bottom" (click)="onClick($event)"></div>
            </div>
          `,
      })
      class SimpleComponent {
        onClick(e: Event) {
          e.stopPropagation();
        }
      }
      const onClickSpy = spyOn(SimpleComponent.prototype, 'onClick').and.callThrough();
      const docContents = `<html><head></head><body>${EVENT_DISPATCH_SCRIPT}<app></app></body></html>`;
      const html = await ssr(SimpleComponent, {doc: docContents});
      const ssrContents = getAppContents(html);
      render(doc, ssrContents);
      resetTViewsFor(SimpleComponent);
      const bottomEl = doc.getElementById('bottom')!;
      bottomEl.click();
      const appRef = await hydrate(doc, SimpleComponent, {
        hydrationFeatures: [withEventReplay()],
      });
      appRef.tick();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
      onClickSpy.calls.reset();
      bottomEl.click();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not have differences in event fields', async () => {
      let currentEvent!: Event;
      @Component({
        standalone: true,
        selector: 'app',
        template: `
            <div id="top" (click)="onClick($event)">
                <div id="bottom" (click)="onClick($event)"></div>
            </div>
          `,
      })
      class SimpleComponent {
        onClick(event: Event) {
          currentEvent = event;
        }
      }
      const docContents = `<html><head></head><body>${EVENT_DISPATCH_SCRIPT}<app></app></body></html>`;
      const html = await ssr(SimpleComponent, {doc: docContents});
      const ssrContents = getAppContents(html);
      render(doc, ssrContents);
      resetTViewsFor(SimpleComponent);
      const bottomEl = doc.getElementById('bottom')!;
      bottomEl.click();
      const appRef = await hydrate(doc, SimpleComponent, {
        hydrationFeatures: [withEventReplay()],
      });
      appRef.tick();
      const replayedEvent = currentEvent;
      bottomEl.click();
      appRef.tick();
      const normalEvent = currentEvent;
      expect(replayedEvent).not.toBe(normalEvent);
      expect(replayedEvent.target).toBe(normalEvent.target);
      expect(replayedEvent.currentTarget).toBe(normalEvent.currentTarget);
      expect(replayedEvent.composedPath).toBe(normalEvent.composedPath);
      expect(replayedEvent.eventPhase).toBe(normalEvent.eventPhase);
    });
  });

  describe('event dispatch script', () => {
    it('should not be present on a page when hydration is disabled', async () => {
      @Component({
        standalone: true,
        selector: 'app',
        template: '<input (click)="onClick()" />',
      })
      class SimpleComponent {
        onClick() {}
      }

      const doc = `<html><head></head><body>${EVENT_DISPATCH_SCRIPT}<app></app></body></html>`;
      const html = await ssr(SimpleComponent, {doc, hydrationDisabled: true});
      const ssrContents = getAppContents(html);

      expect(hasJSActionAttrs(ssrContents)).toBeFalse();
      expect(hasEventDispatchScript(ssrContents)).toBeFalse();
    });

    it('should not be present on a page if there are no events to replay', async () => {
      @Component({
        standalone: true,
        selector: 'app',
        template: 'Some text',
      })
      class SimpleComponent {}

      const html = await ssr(SimpleComponent);
      const ssrContents = getAppContents(html);

      expect(hasJSActionAttrs(ssrContents)).toBeFalse();
      expect(hasEventDispatchScript(ssrContents)).toBeFalse();
    });

    it('should not replay mouse events', async () => {
      @Component({
        standalone: true,
        selector: 'app',
        template: '<div (mouseenter)="doThing()"><div>',
      })
      class SimpleComponent {
        doThing() {}
      }

      const html = await ssr(SimpleComponent);
      const ssrContents = getAppContents(html);

      expect(hasJSActionAttrs(ssrContents)).toBeFalse();
      expect(hasEventDispatchScript(ssrContents)).toBeFalse();
    });

    it('should not be present on a page where event replay is not enabled', async () => {
      @Component({
        standalone: true,
        selector: 'app',
        template: '<input (click)="onClick()" />',
      })
      class SimpleComponent {
        onClick() {}
      }

      const html = await ssr(SimpleComponent, {enableEventReplay: false});
      const ssrContents = getAppContents(html);

      // Expect that there are no JSAction artifacts in the HTML
      // (even though there are events in a template), since event
      // replay is disabled in the config.
      expect(hasJSActionAttrs(ssrContents)).toBeFalse();
      expect(hasEventDispatchScript(ssrContents)).toBeFalse();
    });

    it('should be retained if there are events to replay', async () => {
      @Component({
        standalone: true,
        selector: 'app',
        template: '<input (click)="onClick()" />',
      })
      class SimpleComponent {
        onClick() {}
      }

      const html = await ssr(SimpleComponent);
      const ssrContents = getAppContents(html);

      expect(hasJSActionAttrs(ssrContents)).toBeTrue();
      expect(hasEventDispatchScript(ssrContents)).toBeTrue();

      // Verify that inlined event delegation script goes first and
      // event contract setup goes second (since it uses some code from
      // the inlined script).
      expect(ssrContents).toContain(
        `<script type="text/javascript" id="ng-event-dispatch-contract"></script>` +
          `<script>window.__jsaction_bootstrap('ngContracts', document.body, "ng", ["click"]);</script>`,
      );
    });
  });
});
