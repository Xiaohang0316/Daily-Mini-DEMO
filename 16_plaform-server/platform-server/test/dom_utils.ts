/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {ApplicationRef, Provider, Type, ɵsetDocument} from '@angular/core';
import {getComponentDef} from '@angular/core/src/render3/definition';
import {
  bootstrapApplication,
  HydrationFeature,
  HydrationFeatureKind,
  provideClientHydration,
} from '@angular/platform-browser';

/**
 * The name of the attribute that contains a slot index
 * inside the TransferState storage where hydration info
 * could be found.
 */
const NGH_ATTR_NAME = 'ngh';
const EMPTY_TEXT_NODE_COMMENT = 'ngetn';
const TEXT_NODE_SEPARATOR_COMMENT = 'ngtns';

const NGH_ATTR_REGEXP = new RegExp(` ${NGH_ATTR_NAME}=".*?"`, 'g');
const EMPTY_TEXT_NODE_REGEXP = new RegExp(`<!--${EMPTY_TEXT_NODE_COMMENT}-->`, 'g');
const TEXT_NODE_SEPARATOR_REGEXP = new RegExp(`<!--${TEXT_NODE_SEPARATOR_COMMENT}-->`, 'g');

/**
 * Drop utility attributes such as `ng-version`, `ng-server-context` and `ngh`,
 * so that it's easier to make assertions in tests.
 */
export function stripUtilAttributes(html: string, keepNgh: boolean): string {
  html = html
    .replace(/ ng-version=".*?"/g, '')
    .replace(/ ng-server-context=".*?"/g, '')
    .replace(/ ng-reflect-(.*?)=".*?"/g, '')
    .replace(/ _nghost(.*?)=""/g, '')
    .replace(/ _ngcontent(.*?)=""/g, '');
  if (!keepNgh) {
    html = html
      .replace(NGH_ATTR_REGEXP, '')
      .replace(EMPTY_TEXT_NODE_REGEXP, '')
      .replace(TEXT_NODE_SEPARATOR_REGEXP, '');
  }
  return html;
}

/**
 * Extracts a portion of HTML located inside of the `<body>` element.
 * This content belongs to the application view (and supporting TransferState
 * scripts) rendered on the server.
 */
export function getAppContents(html: string): string {
  const result = stripUtilAttributes(html, true).match(/<body>(.*?)<\/body>/s);
  return result ? result[1] : html;
}

/**
 * Converts a static HTML to a DOM structure.
 *
 * @param html the rendered html in test
 * @param doc the document object
 * @returns a div element containing a copy of the app contents
 */
function convertHtmlToDom(html: string, doc: Document): HTMLElement {
  const contents = getAppContents(html);
  const container = doc.createElement('div');
  container.innerHTML = contents;
  return container;
}

/**
 * Reset TView, so that we re-enter the first create pass as
 * we would normally do when we hydrate on the client. Otherwise,
 * hydration info would not be applied to T data structures.
 */
export function resetTViewsFor(...types: Type<unknown>[]) {
  for (const type of types) {
    getComponentDef(type)!.tView = null;
  }
}

export function hydrate(
  doc: Document,
  component: Type<unknown>,
  options?: {
    envProviders?: Provider[];
    hydrationFeatures?: HydrationFeature<HydrationFeatureKind>[];
  },
) {
  function _document(): any {
    ɵsetDocument(doc);
    global.document = doc; // needed for `DefaultDomRenderer2`
    return doc;
  }

  const envProviders = options?.envProviders ?? [];
  const hydrationFeatures = options?.hydrationFeatures ?? [];
  const providers = [
    ...envProviders,
    {provide: DOCUMENT, useFactory: _document, deps: []},
    provideClientHydration(...hydrationFeatures),
  ];

  return bootstrapApplication(component, {providers});
}

export function render(doc: Document, html: string) {
  // Get HTML contents of the `<app>`, create a DOM element and append it into the body.
  const container = convertHtmlToDom(html, doc);
  Array.from(container.childNodes).forEach((node) => doc.body.appendChild(node));
}

/**
 * This bootstraps an application with existing html and enables hydration support
 * causing hydration to be invoked.
 *
 * @param html the server side rendered DOM string to be hydrated
 * @param component the root component
 * @param envProviders the environment providers
 * @returns a promise with the application ref
 */
export async function renderAndHydrate(
  doc: Document,
  html: string,
  component: Type<unknown>,
  options?: {
    envProviders?: Provider[];
    hydrationFeatures?: HydrationFeature<HydrationFeatureKind>[];
  },
): Promise<ApplicationRef> {
  render(doc, html);
  return hydrate(doc, component, options);
}
