import { EventEmitter } from 'angular2/core';
import { Component, View, Inject } from 'angular2/core';
import { DataService } from '../src/appServices.js';

//import {THREE} from 'three-jsnext';

import THREE from '../node_modules/three.js/build/three.js';

@Component({
    selector: 'div.particleSystem'
})
@View({
    template: '<ng-content></ng-content>'
})
export class ParticleSystem {

    constructor() {
        var container;
        //var stats;
        var camera, scene, renderer, particles, geometry, material, i, h, color, sprite, size;
        var mouseX = 0, mouseY = 0;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        init();
        animate();

        function init() {

            container = document.createElement( 'div' );
            document.body.appendChild( container );

            camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
            camera.position.z = 1000;

            scene = new THREE.Scene();
            //scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

            geometry = new THREE.Geometry();

            //sprite = THREE.ImageUtils.loadTexture( "textures/sprites/disc.png" );

            for ( i = 0; i < 10000; i ++ ) {

                var vertex = new THREE.Vector3();
                vertex.x = 2000 * Math.random() - 1000;
                vertex.y = 2000 * Math.random() - 1000;
                vertex.z = 0;

                geometry.vertices.push( vertex );

            }

            material = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false, alphaTest: 0, transparent: true, color: 0xffffff } );
            console.log(material)
            material.color.setHSL( 1, 1, 1 );

            particles = new THREE.Points( geometry, material );
            scene.add( particles );
            //

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            //

            //stats = new Stats();
            //stats.domElement.style.position = 'absolute';
            //stats.domElement.style.top = '0px';
            //container.appendChild( stats.domElement );

            //

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            document.addEventListener( 'touchstart', onDocumentTouchStart, false );
            document.addEventListener( 'touchmove', onDocumentTouchMove, false );

            //

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }

        function onDocumentMouseMove( event ) {

            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;

        }

        function onDocumentTouchStart( event ) {

            if ( event.touches.length == 1 ) {

                event.preventDefault();

                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;

            }
        }

        function onDocumentTouchMove( event ) {

            if ( event.touches.length == 1 ) {

                event.preventDefault();

                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                mouseY = event.touches[ 0 ].pageY - windowHalfY;

            }

        }

        //

        function animate() {

            requestAnimationFrame( animate );

            render();
            //stats.update();

        }

        function render() {

            //var time = Date.now() * 0.00005;

            //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
            //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

            camera.lookAt( scene.position );

            //h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
            material.color.setHSL( h, 0.5, 0.5 );

            renderer.render( scene, camera );

        }
    }
    ngAfterViewInit() {

    }
}

//@Component({
//    selector: 'svg.scalable',
//    events: ['zoom'],
//})
//@View({
//    template: '<ng-content></ng-content>'
//})
//export class Scalable{
//    zoom = new EventEmitter();
//    constructor() {
//    }
//    ngAfterViewInit() {
//        var zoomListener = d3.behavior.zoom().on("zoom", () => {
//            this.zoom.next(d3.event)
//        });
//        zoomListener(d3.select('.scalable'));
//    }
//}

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