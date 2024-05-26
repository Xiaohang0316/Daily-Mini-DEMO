/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  DOCUMENT,
  PlatformLocation,
  ViewportScroller,
  ɵgetDOM as getDOM,
  ɵNullViewportScroller as NullViewportScroller,
  ɵPLATFORM_SERVER_ID as PLATFORM_SERVER_ID,
} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {
  createPlatformFactory,
  Injector,
  NgModule,
  Optional,
  PLATFORM_ID,
  PLATFORM_INITIALIZER,
  platformCore,
  PlatformRef,
  Provider,
  StaticProvider,
  Testability,
  ɵALLOW_MULTIPLE_PLATFORMS as ALLOW_MULTIPLE_PLATFORMS,
  ɵsetDocument,
  ɵTESTABILITY as TESTABILITY,
} from '@angular/core';
import {BrowserModule, EVENT_MANAGER_PLUGINS} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {DominoAdapter, parseDocument} from './domino_adapter';
import {SERVER_HTTP_PROVIDERS} from './http';
import {ServerPlatformLocation} from './location';
import {PlatformState} from './platform_state';
import {ServerEventManagerPlugin} from './server_events';
import {INITIAL_CONFIG, PlatformConfig} from './tokens';
import {TRANSFER_STATE_SERIALIZATION_PROVIDERS} from './transfer_state';

export const INTERNAL_SERVER_PLATFORM_PROVIDERS: StaticProvider[] = [
  {provide: DOCUMENT, useFactory: _document, deps: [Injector]},
  {provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID},
  {provide: PLATFORM_INITIALIZER, useFactory: initDominoAdapter, multi: true},
  {
    provide: PlatformLocation,
    useClass: ServerPlatformLocation,
    deps: [DOCUMENT, [Optional, INITIAL_CONFIG]],
  },
  {provide: PlatformState, deps: [DOCUMENT]},
  // Add special provider that allows multiple instances of platformServer* to be created.
  {provide: ALLOW_MULTIPLE_PLATFORMS, useValue: true},
];

function initDominoAdapter() {
  return () => {
    DominoAdapter.makeCurrent();
  };
}

export const SERVER_RENDER_PROVIDERS: Provider[] = [
  {provide: EVENT_MANAGER_PLUGINS, multi: true, useClass: ServerEventManagerPlugin},
];

export const PLATFORM_SERVER_PROVIDERS: Provider[] = [
  TRANSFER_STATE_SERIALIZATION_PROVIDERS,
  SERVER_RENDER_PROVIDERS,
  SERVER_HTTP_PROVIDERS,
  {provide: Testability, useValue: null}, // Keep for backwards-compatibility.
  {provide: TESTABILITY, useValue: null},
  {provide: ViewportScroller, useClass: NullViewportScroller},
];

/**
 * The ng module for the server.
 *
 * @publicApi
 */

// 
@NgModule({
  exports: [BrowserModule],
  imports: [HttpClientModule, NoopAnimationsModule],
  providers: PLATFORM_SERVER_PROVIDERS,
})
export class ServerModule {}

function _document(injector: Injector) {
  const config: PlatformConfig | null = injector.get(INITIAL_CONFIG, null);
  let document: Document;
  if (config && config.document) {
    document =
      typeof config.document === 'string'
        ? parseDocument(config.document, config.url)
        : config.document;
  } else {
    document = getDOM().createHtmlDocument();
  }
  // Tell ivy about the global document
  ɵsetDocument(document);
  return document;
}

/**
 * @publicApi
 */
export const platformServer: (extraProviders?: StaticProvider[] | undefined) => PlatformRef =
  createPlatformFactory(platformCore, 'server', INTERNAL_SERVER_PLATFORM_PROVIDERS);
