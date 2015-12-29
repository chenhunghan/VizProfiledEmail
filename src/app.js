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

//import { Scalable } from '../src/appComponents.js'
//import { nodes } from '../src/appComponents.js'
//import { links } from '../src/appComponents.js'
import { ParticleSystem } from '../src/appComponents.js'

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
    directives: [NgClass, ParticleSystem],
    styles: [`
        .svgWrapper {
            padding:0;
            margin:0;
        }
        .svg {
            padding:0;
            margin:0;
        }
        .thread {
        }
    `],
    template: `
            <!--<div class="particleSystem"></div>-->
            <div
                [ngClass]="'svgWrapper'"
                >
                <svg
                    [attr.width]="dataService.options.width"
                    [attr.height]="dataService.options.height"
                    [ngClass]="'svg'"
                    xmlns = "http://www.w3.org/2000/svg"
                    version = 1.2
                    >
                    <text x=10 y=20>similarity algorithm {{dataService.restructurePercentage}} %</text>
                    <text x=10 y=40>layout algorithm {{dataService.layoutStructurePercentage}} %</text>

                    <g [attr.transform]="zoomScalePar">
                        <g [attr.transform]="resetScalePar">
                            <g *ngFor="#thread of threads"
                               [attr.transform]="getThreadTransform(thread)"
                               >
                              <rect
                                [attr.width]="getThreadWidth(thread)"
                                [attr.height]="getThreadHeight(thread)"
                                [ngClass]="'thread'"
                                [attr.style]="getThreadStyle(thread)"
                              ></rect>
                              <text
                                x=5 y=3
                                [ngClass]="'threadSubject'"
                                [attr.style]="getTextStyle(thread)"
                                >{{thread.subject}}
                              </text>
                            </g>
                            <line *ngFor="#link of links"
                               [ngClass]="'link'"
                               [attr.style]="getLinkStyle(link)"
                               [attr.x1]="link.source.x"
                               [attr.y1]="link.source.y"
                               [attr.x2]="link.target.x"
                               [attr.y2]="link.target.y">
                            </line>
                        </g>
                    </g>
                </svg>
            </div>
        `
})
export class App{

    constructor(
        dataService:DataService
    ){
        this.dataService = dataService
        this.getData()


        //window.zone.run(function () {
        //
        //})
        //let s = setInterval(function(){
        //
        //}, 200);
    }
    ngAfterViewInit() {
        let zoomListener = d3.behavior.zoom().on("zoom", () => {
            this.zoomScalePar = `translate(${d3.event.translate}) scale(${d3.event.scale})`
        });
        zoomListener(d3.select('.svg'));
    }
    async getData() {
        let data = await this.dataService.getData()
        this.threads = data.threads
        this.links = data.links

        let autoScale = setInterval(() => {
            if (this.dataService.layoutStructurePercentage === 100) {
                let resetYScale = data.maxY-data.minY,
                    resetXScale = data.maxX-data.minX;
                this.resetScalar = this.dataService.options.height/resetYScale
                let resetTranslateX = resetXScale*this.resetScalar*0.5,
                    resetTranslateY = resetYScale*this.resetScalar*0.35;
                this.resetScalePar = `translate(${resetTranslateX},${resetTranslateY}) scale(${this.resetScalar})`
                clearInterval(autoScale);
            }
        }, 200);

    }
    getThreadStyle(d) {
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
    getThreadWidth(d) {
        return d.subject.length*5.5+5;
    }
    getThreadHeight(d) {
        return d.email_list.length*20;
    }
    getThreadTransform(d) {
        return 'translate(' + [d.x, d.y] + ')';
    }
    //onZoom = (e) => {
    //    //add
    //    //class="scalable"
    //    //(zoom)="onZoom($event)"
    //    //to svg
    //
    //    this.scalePar = `translate(${e.translate}) scale(${e.scale})`
    //}
}

