import * as THREE from "./three.module.js";
import RandomTriangles from "./triangles.js";

/*
COLORS
0xF1F4FF - silver
0xA2A2A1 - gray 1
0xFFFFFF - white
0x202020 - gray 2
0xFF2020 - kinda red
0x4040FF - kinda blue
0x00C040 - kinda green
*/

// CONSTANTS
var X1, X3, Y1, Y3;

// MEDIA QUERY
/*
function mquery(q){
    if (q.matches){
        X1 = 0;
        X3 = 0;
        Y1 = -6;
        Y3 = 6;
        console.log("<800");
    }
    else{
        X1 = -6;
        X3 = 6;
        Y1 = 0;
        Y3 = 0;
        console.log(">800");
    }
}
*/
X1 = -6;
X3 = 6;
Y1 = 0;
Y3 = 0;
//var q = window.matchMedia("(min-width: 800px)");
//mquery(q);

// light
const light1 = new THREE.DirectionalLight( 0xFFFFFF, 1 );
light1.position.set( -1, 2, 5);
const light2 = new THREE.PointLight( 0xFFFFFF, 1 );
light2.position.set( -1, 2, 5);

// scene
const scene = new THREE.Scene();
scene.add(light2);

// camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
camera.add(light1);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x202020, 1);
document.body.appendChild( renderer.domElement );
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";

// Canvas
const ctx1 = document.createElement('canvas').getContext('2d');
ctx1.canvas.width = 250;
ctx1.canvas.height = 50;
ctx1.fillStyle = "#FF4040";
ctx1.fillRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
ctx1.fillStyle = "#202020";
ctx1.font = "40px Itim";
ctx1.fillText("About Myself",15,35);

const ctx2 = document.createElement('canvas').getContext('2d');
ctx2.canvas.width = 250;
ctx2.canvas.height = 50;
ctx2.fillStyle = "#4040FF";
ctx2.fillRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
ctx2.fillStyle = "#202020";
ctx2.font = "40px Itim";
ctx2.fillText("My Works",15,35);

const ctx3 = document.createElement('canvas').getContext('2d');
ctx3.canvas.width = 250;
ctx3.canvas.height = 50;
ctx3.fillStyle = "#00C040";
ctx3.fillRect(0, 0, ctx3.canvas.width, ctx3.canvas.height);
ctx3.fillStyle = "#202020";
ctx3.font = "40px Itim";
ctx3.fillText("Contact me",15,35);

camera.position.z = 5;

// Textures
const texture1 = new THREE.CanvasTexture(ctx1.canvas);
texture1.needsUpdate = true;
const texture2 = new THREE.CanvasTexture(ctx2.canvas);
texture2.needsUpdate = true;
const texture3 = new THREE.CanvasTexture(ctx3.canvas);
texture3.needsUpdate = true;

// Geometries
const planegeo1 = new THREE.PlaneGeometry( 5, 1 );
const planegeo2 = new THREE.PlaneGeometry( 5, 1 );
const planegeo3 = new THREE.PlaneGeometry( 5, 1 );

// Materials
const planematerial1 = new THREE.MeshPhongMaterial( { map: texture1 } );
const lmaterial1 = new THREE.MeshPhongMaterial( { color: 0xFF4040 } )
const planematerial2 = new THREE.MeshPhongMaterial( { map: texture2 } );
const lmaterial2 = new THREE.MeshPhongMaterial( { color: 0x4040FF } )
const planematerial3 = new THREE.MeshPhongMaterial( { map: texture3 } );
const lmaterial3 = new THREE.MeshPhongMaterial( { color: 0x00C040 } )

// Meshs
const planemesh1 = new THREE.Mesh( planegeo1, planematerial1 );
planemesh1.name = "about";
scene.add( planemesh1 );
planemesh1.position.set(X1,Y1,-2);

const planemesh2 = new THREE.Mesh( planegeo2, planematerial2 );
planemesh2.name = "work";
scene.add( planemesh2 );
planemesh2.position.set(0,0,-2);

const planemesh3 = new THREE.Mesh( planegeo3, planematerial3 );
planemesh3.name = "contact";
scene.add( planemesh3 );
planemesh3.position.set(X3,Y3,-2);

const triangles1 = new RandomTriangles( X1, Y1, -4.6, 200, 5, lmaterial1, scene );
triangles1.createTriangles();

const triangles2 = new RandomTriangles( 0, 0, -4.6, 200, 5, lmaterial2, scene );
triangles2.createTriangles();

const triangles3 = new RandomTriangles( X3, Y3, -4.6, 200, 5, lmaterial3, scene );
triangles3.createTriangles();

var active_ray = [planemesh1, planemesh2, planemesh3];
var mouse = { x: -1.0, y: -1.0 };
var pickedObj;
var spread_count = [0,0,0];
const spreaderx = [...Array(200)].map(_=>(Math.random()-0.5));
const spreadery = [...Array(200)].map(_=>(Math.random()-0.5));

const raycaster = new THREE.Raycaster();

function expander(triangles){
    for (let i = 0; i < triangles.mesh_arr.length; i++) {
        triangles.mesh_arr[i].position.x += spreaderx[i];
        triangles.mesh_arr[i].position.y += spreadery[i];
        //mesh_arr1[i].rotation.y += 0.005;
    }
}

function shrinker(triangles){
    for (let i = 0; i < triangles.mesh_arr.length; i++) {
        triangles.mesh_arr[i].position.x -= spreaderx[i];
        triangles.mesh_arr[i].position.y -= spreadery[i];
    }
}

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function clearPickPosition() {
    mouse.x = -100.0;
    mouse.y = -100.0;
}

function animate() {
    requestAnimationFrame( animate );
    
    raycaster.setFromCamera( mouse, camera );
    const intersectedObjs = raycaster.intersectObjects(active_ray);

    if (intersectedObjs.length){
        pickedObj = intersectedObjs[0].object;
        if (pickedObj.name==="about"){
            if (spread_count[0]<40){
                expander(triangles1);
                spread_count[0]+=1;
            }
        }
        else if (pickedObj.name==="work"){
            if (spread_count[1]<40){
                expander(triangles2);
                spread_count[1]+=1;
            }
        }
        else if (pickedObj.name==="contact"){
            if (spread_count[2]<40){
                expander(triangles3);
                spread_count[2]+=1;
            }
        }
    }
    else{
        if (spread_count[0]>0){
            shrinker(triangles1);
            spread_count[0]-=1;
        }
        else if (spread_count[1]>0){
            shrinker(triangles2);
            spread_count[1]-=1;
        }
        else if (spread_count[2]>0) {
            shrinker(triangles3);
            spread_count[2]-=1;
        }
    }
    texture1.needsUpdate = true;
    texture2.needsUpdate = true;
    texture3.needsUpdate = true;
	renderer.render( scene, camera );
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);

window.addEventListener('touchstart', (event) => {
// prevent the window from scrolling
event.preventDefault();
onMouseMove(event.touches[0]);
}, {passive: false});
window.addEventListener('touchmove', (event) => {
    onMouseMove(event.touches[0]);
});
window.addEventListener('touchend', clearPickPosition);

animate();