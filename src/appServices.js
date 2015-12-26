import { Injectable, Inject} from 'angular2/core';
//import { EventEmitter } from 'angular2/core';
import { Http } from 'angular2/http';

import buildNodesLinksWebWorker from "worker!../src/buildNodesLinksWebWorker.js";
import forceLayoutWebWorker from "worker!../src/forceLayoutWebWorker.js";

@Injectable()
export class JsonDataService {
    http;
    constructor(http:Http) {
        this.http = http
    }
    getData() {
        return this.http.get('json/user_shelly.json')
    }
}

@Injectable()
export class DataService {
    layoutData = []
    restructurePercentage = 0
    layoutStructurePercentage = 0
    //event
    options = {
        quantity: 10,
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        forceCharge: -1000,
        forceGravity: 0.08,
        linkDistance: this.width/30,
        animation: false,
        coolDownStop: 0.036,
        iterationN: 10000
    }
    constructor(
        jsonDataService:JsonDataService
    ) {
       //this.event = new EventEmitter();
       this.jsonDataService = jsonDataService
       this.NodesLinksWebWorker = new buildNodesLinksWebWorker;
       this.forceLayoutWebWorker = new forceLayoutWebWorker;
        this.jsonDataService.getData().subscribe((data) => {
            let inputData = {
                data: data.json(),
                options: this.options
            }
            this.NodesLinksWebWorker.postMessage(JSON.stringify(inputData));
            this.NodesLinksWebWorker.onmessage = (structuredMessage) => {
                this.restructurePercentage = structuredMessage.data.percentage
                //this.event.next({
                //    restructurePercentage: this.restructurePercentage,
                //})
                if (this.restructurePercentage === 100) {
                    let inputData = {
                        data: structuredMessage.data,
                        options: this.options
                    }
                    this.forceLayoutWebWorker.postMessage(JSON.stringify(inputData));
                    this.forceLayoutWebWorker.onmessage = (forceLayoutMessage) => {
                        this.layoutStructurePercentage = forceLayoutMessage.data.percentage
                        if (this.options.animation) {
                            this.layoutData = forceLayoutMessage.data
                        } else if (forceLayoutMessage.data.percentage === 100){
                            this.layoutData = forceLayoutMessage.data
                        }

                        //this.event.next({
                        //    layoutData: this.layoutData,
                        //    restructurePercentage: this.restructurePercentage,
                        //    layoutStructurePercentage:  this.layoutStructurePercentage
                        //})
                    }
                }
            }
        })
    }
}

//@Injectable()
//export class BuildNodesLinksService {
//    jsonDataService;
//    result
//    constructor(@Inject(JsonDataService) jsonDataService) {
//        jsonDataService.getData().subscribe((data) => {
//            let dataStructureworker = new buildNodesLinksWebworker;
//            dataStructureworker.postMessage(JSON.stringify(data.json()));
//            dataStructureworker.onmessage = function (message) {
//                this.result = message.data
//            }
//        })
//    }
//    getStructuredData() {
//        return this.result
//    }
//}
//
//@Injectable()
//export class BuildForceLayoutService {
//    buildNodesLinksService
//    constructor(@Inject(BuildNodesLinksService) buildNodesLinksService) {
//        console.log(buildNodesLinksService.getStructuredData())
//    }
//    getForceLayoutData() {
//
//        //this.buildNodesLinksService().getStructuredData()
//        //console.log( this.nodesLinks)
//        //this.forceLayoutWebworker = new forceLayoutWebworker;
//        //this.forceLayoutWebworker.postMessage(JSON.stringify(this.nodesLinks));
//        //return this.forceLayoutWebworker.onmessage = function (data) {
//        //    return data
//        //}
//    }
//}


//
//var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
//
//export function topoLayoutEngine () {
//        return {
//            preProcess: function(raw, cb) {
//                var data = {}
//                this.processPosData(data, cb);
//            },
//            processPosData: function(data, cb, width, height) {
//                var force, i, n, that
//                that = this;
//                force = d3.layout.force().nodes(data.nodes).links(data.links)
//                    .charge(-4800).linkDistance(120)
//                    .size([width, height]).gravity(0.25).on('tick', function(a) {
//                    if (a.alpha < 0.036) {
//                        force.nodes().forEach(function(o, i) {
//                            o.x = o.x * 1.5 - 350;
//                            return o.y = o.y * 0.6 + 30;
//                        });
//                        force.nodes().forEach(function(o, i) {
//                            if (o.x < 30) {
//                                o.x = 50;
//                            }
//                            if (o.x > (width - 250)) {
//                                o.x = width - 250;
//                            }
//                            if (o.y < 30) {
//                                o.y = 50;
//                            }
//                            if (o.y > (height - 150)) {
//                                return o.y = height - 150;
//                            }
//                        });
//                        that.finalize(force.nodes(), force.links(), cb);
//                        force.stop();
//                    }
//                });
//                n = 100;
//                force.start();
//                i = 0;
//                while (i < n) {
//                    force.tick();
//                    ++i;
//                }
//                force.stop();
//            },
//            finalize: function(nodes_w_pos, links_w_pos, cb) {
//                var data;
//                data = {
//                    nodes: nodes_w_pos,
//                    links: links_w_pos
//                };
//                return cb(data);
//            }
//        };
//    }
