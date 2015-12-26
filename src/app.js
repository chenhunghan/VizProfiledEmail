//import "../node_modules/bootstrap/dist/css/bootstrap.css"
//import "../node_modules/angular-material/angular-material.css"
//import "../src/css/index.css"
//import "../node_modules/angular/angular.js"
//import "../node_modules/angular-ui-router/build/angular-ui-router.js"
//import "../node_modules/angular-aria/angular-aria.js"
//import "../node_modules/angular-animate/angular-animate.js"
//import "../node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js"
//import "../node_modules/angular-material/angular-material.js"
//import "../node_modules/angular-messages/angular-messages.js"
//import _ from "underscore"
//import loremIpsum from 'lorem-ipsum'
//import randomColor from "randomcolor"
//import { config } from "../src/appConfig.js"
//import { mainController } from "../src/appControllers.js"
//import { topoLayoutEngine } from "../src/appServices.js"
//angular.module('profileViz', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngMessages'])
//angular.module('profileViz', ['ui.router'])
//    .config(config)
//    .controller('mainController', mainController)
//    .service('topoLayoutEngine', topoLayoutEngine)

import d3 from 'd3'

import { DataService } from '../src/appServices.js';
import { JsonDataService } from '../src/appServices.js';

import { Scalable } from '../src/appComponents.js'
//import { nodes } from '../src/appComponents.js'
//import { links } from '../src/appComponents.js'

import { Component, View, Inject} from 'angular2/core';
import { NgClass } from 'angular2/common'
import { EventEmitter } from 'angular2/core';
//import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
//import {Http} from 'angular2/http';

// webpack-dev-server and
// go to http://localhost:8080/webpack-dev-server/index.html

@Component({
    selector: 'app',
    providers: [
        DataService,
        JsonDataService
    ],
})
@View({
    directives: [NgClass, Scalable],
    styles: [`
        .svgWrapper {
        }
        .svg {
        }
        .node {
        }
    `],
    template: `
            <div
                [ngClass]="'svgWrapper'"
                >
                <svg
                    [attr.width]="dataService.options.width"
                    [attr.height]="dataService.options.height"
                    [ngClass]="'svg'"
                    xmlns = "http://www.w3.org/2000/svg"
                    version = 1.2
                    class="scalable"
                    (zoom)="onZoom($event)"
                    >
                    <text x=10 y=20>similarity algorithm {{dataService.restructurePercentage}}</text>
                    <text x=10 y=40>layout algorithm {{dataService.layoutStructurePercentage}}</text>
                    <g
                        [attr.transform]="scalePar">
                        <g *ngFor="#node of dataService.layoutData.nodes"
                           [attr.transform]="getNodeTransform(node)"
                           >
                          <rect
                            [attr.width]="getNodeWidth(node)"
                            [attr.height]="getNodeHeight(node)"
                            [ngClass]="'node'"
                            [attr.style]="getNodeStyle(node)"
                          ></rect>
                          <text
                            x=5 y=3
                            [ngClass]="'nodeText'"
                            [attr.style]="getTextStyle(node)"
                            >{{node.subject}}
                          </text>
                        </g>
                        <line *ngFor="#link of dataService.layoutData.links"
                           [ngClass]="'link'"
                           [attr.style]="getLinkStyle(link)"
                           [attr.x1]="link.source.x"
                           [attr.y1]="link.source.y"
                           [attr.x2]="link.target.x"
                           [attr.y2]="link.target.y">
                        </line>
                    </g>
                </svg>
            </div>
        `
})
export class App{
    scale = 0.3

    constructor(
        dataService:DataService
    ){
        this.dataService = dataService
        window.zone.run(function () {
            let s = setInterval(function(){
                if (dataService.layoutStructurePercentage === 100) {
                    clearInterval(s);
                }
            }, 200);
        })
    }
    ngAfterViewInit() {

    }
    getNodeStyle(d) {
        return `fill: #ccc;
                opacity: ${d.email_list.length*0.25};
                `
    }
    getTextStyle(d) {
        return `fill: #000000;
                font-size: ${d.email_list.length*10};
                opacity: ${d.email_list.length*0.3};
                `
    }
    getLinkStyle(d) {
        return `stroke: #000;
                stroke-width: 1px;
                opacity: ${d.similarity*0.25};
               `
    }
    getNodeWidth(d) {
        return d.subject.length*5.5+5;
    }
    getNodeHeight(d) {
        return d.email_list.length*20;
    }
    getNodeTransform(d) {
        return 'translate(' + [d.x, d.y] + ')';
    }
    onZoom = (e) => {
        this.scalePar = `translate(${e.translate}) scale(${e.scale})`
    };


}

