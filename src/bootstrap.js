// polyfills
// Polyfills
import 'es6-shim';
import 'es6-promise';
import 'es7-reflect-metadata/dist/browser';
import 'zone.js/lib/browser/zone-microtask';
import 'zone.js/lib/browser/long-stack-trace-zone'; // in Production you may want to remove this

// Angular 2
import 'angular2/platform/browser';
import 'angular2/platform/common_dom';
import 'angular2/core';
import 'angular2/router';
import 'angular2/http';

// RxJS
import 'rxjs';

import { bootstrap } from 'angular2/bootstrap';
import { provide } from 'angular2/core';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy}  from 'angular2/router';
import {  HTTP_PROVIDERS } from 'angular2/http';
import { App } from '../src/app.js';

// include for development builds
import { ELEMENT_PROBE_PROVIDERS } from 'angular2/platform/common_dom';

// include for production builds
//import {enableProdMode} from 'angular2/core';

import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../src/css/index.css"

//enableProdMode() // include for production builds
function main() {
    return bootstrap(App, [
        ROUTER_PROVIDERS,
        ELEMENT_PROBE_PROVIDERS,  // remove in production
        HTTP_PROVIDERS,
        provide(LocationStrategy, {useClass: HashLocationStrategy})
    ]).catch(err => console.error(err)); // eslint-disable-line
}

document.addEventListener('DOMContentLoaded', main);
