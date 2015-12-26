import { EventEmitter } from 'angular2/core';
import { Component, View, Inject } from 'angular2/core';
import { DataService } from '../src/appServices.js';

@Component({
    selector: 'svg.scalable',
    events: ['zoom'],
})
@View({
    template: '<ng-content></ng-content>'
})
export class Scalable{
    zoom = new EventEmitter();
    constructor() {
    }
    ngAfterViewInit() {
        var zoomListener = d3.behavior.zoom().on("zoom", () => {
            this.zoom.next(d3.event)
        });
        zoomListener(d3.select('.scalable'));
    }
}

//@Component({ selector: 'g.nodes' })
//@View({
//    template: `
//               <g
//                  *ngFor="#node of dataService.layoutData.nodes"
//                  class="gnode"
//                  [attr.x]="node.x"
//                  [attr.y]="node.y"
//                  >
//                  <rect width="40" height="30"
//                        class="node"
//                        />
//                  <text>{{node.x}}</text>
//              </g>`
//})
//export class nodes{
//    dataService
//    constructor(
//        @Inject(DataService) dataService
//    ){
//        this.dataService = dataService;
//
//    }
//
//}
//
//@Component({ selector: 'g.links' })
//@View({
//    template: '<line class="link"></line>'
//})
//export class links{}