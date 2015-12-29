import { Injectable, Inject} from 'angular2/core';
//import { EventEmitter } from 'angular2/core';
import { Http } from 'angular2/http';

import buildNodesLinksWebWorker from "worker!../src/buildNodesLinksWebWorker.js";
import forceLayoutWebWorker from "worker!../src/forceLayoutWebWorker.js";

@Injectable()
export class JsonDataService {
    constructor(http:Http) {
        this.http = http
    }
    getJSON() {
        var that = this
        return new Promise( function (resolve, reject) {
            that.http.get('json/user_shelly.json').subscribe((data) => {
                resolve(data.json());
            })
        });
    }
}

@Injectable()
export class DataService {
    options = {
        quantity: 100,
        width: Math.min(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.min(document.documentElement.clientHeight, window.innerHeight || 0),
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
       this.jsonDataService = jsonDataService;
       this.NodesLinksWebWorker = new buildNodesLinksWebWorker;
       this.forceLayoutWebWorker = new forceLayoutWebWorker;
       this.restructurePercentage = 0;
       this.layoutStructurePercentage = 0;
    }
    async getData() {
        let data = await this.jsonDataService.getJSON();
        let structuredMessage = await this.getNodesLinks(data);
        let forceLayout = await this.getForceLayout(structuredMessage)
        return forceLayout
    }
    getNodesLinks(data) {
        var that = this
        return new Promise( (resolve, reject) => {
            let inputData = {
                data: data,
                options: that.options
            }
            that.NodesLinksWebWorker.postMessage(JSON.stringify(inputData));
            that.NodesLinksWebWorker.onmessage = (structuredMessage) => {
                that.restructurePercentage = structuredMessage.data.percentage
                if (that.restructurePercentage === 100) {
                    resolve(structuredMessage);
                }
            }
        });
    }
    getForceLayout(structuredMessage) {
        var that = this
        return new Promise( (resolve, reject) => {
            let inputData = {
                data: structuredMessage.data,
                options: that.options
            }
            that.forceLayoutWebWorker.postMessage(JSON.stringify(inputData));
            that.forceLayoutWebWorker.onmessage = (forceLayoutMessage) => {
                that.layoutStructurePercentage = forceLayoutMessage.data.percentage
                if (that.options.animation) {
                    resolve(forceLayoutMessage.data)
                } else if (forceLayoutMessage.data.percentage === 100){
                    resolve(forceLayoutMessage.data)
                }
            }
        });
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
