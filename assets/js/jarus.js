// CONSTANTS
const NUMBER_OF_TRIANGLES = 500;
const VIEW_RADIUS = 50;
const TRIANGLE_SIZE = 8;
const DEPTH = 30;
const POS_OFFSET = 20;

// MEDIA QUERY


// scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// light
const light1 = new THREE.PointLight( 0xF1F4FF );
light1.position.set( -10, 20, 50);
scene.add(light1);

const light2 = new THREE.PointLight( 0xF1F4FF );
light2.position.set( 10, -20, -50);
scene.add(light2);

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xA2A2A1, 1);
document.body.appendChild( renderer.domElement );
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";

const material = new THREE.MeshPhongMaterial( { color: 0xF1F4FF } );

function disposeArray() {
    this.array = null;
}

function create_triangles() {

    //const geometry = new THREE.BufferGeometry();
    var mesh_arr = [];

    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();

    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    for (let i = 0; i < NUMBER_OF_TRIANGLES; i++) {

        const geometry = new THREE.BufferGeometry();

        var positions = [];
        var normals = [];

        var x = (Math.random()-0.5)*VIEW_RADIUS;
        var y = (Math.random()-0.5)*VIEW_RADIUS;
        var z = (Math.random()-1)*DEPTH;

        if (z>POS_OFFSET){z=z-POS_OFFSET}

        const ax = x + (Math.random()-0.5)*TRIANGLE_SIZE;
        const ay = y + (Math.random()-0.5)*TRIANGLE_SIZE;
        const az = z + (Math.random()-0.5)*TRIANGLE_SIZE;

        const bx = x + (Math.random()-0.5)*TRIANGLE_SIZE;
        const by = y + (Math.random()-0.5)*TRIANGLE_SIZE;
        const bz = z + (Math.random()-0.5)*TRIANGLE_SIZE;

        const cx = x + (Math.random()-0.5)*TRIANGLE_SIZE;
        const cy = y + (Math.random()-0.5)*TRIANGLE_SIZE;
        const cz = z + (Math.random()-0.5)*TRIANGLE_SIZE;

        positions.push( ax, ay, az );
        positions.push( bx, by, bz );
        positions.push( cx, cy, cz );

        // flat face normals

        pA.set( ax, ay, az );
        pB.set( bx, by, bz );
        pC.set( cx, cy, cz );

        cb.subVectors( pC, pB );
        ab.subVectors( pA, pB );
        cb.cross( ab );

        cb.normalize();

        const nx = cb.x;
        const ny = cb.y;
        const nz = cb.z;

        normals.push( nx, ny, nz );
        normals.push( nx, ny, nz );
        normals.push( nx, ny, nz );

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );

        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( x, y, z);
        mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation( -x, -y, -z ) );
        scene.add( mesh );

        mesh_arr.push( mesh );
    }

    return mesh_arr
}

mesh_arr_objs = create_triangles();

const ctx = document.createElement('canvas').getContext('2d');
ctx.canvas.width = 250;
ctx.canvas.height = 50;
ctx.fillStyle = '#FFF';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.fillStyle = '#A2A2A1';
ctx.font = "40px Itim";
ctx.fillText("Under devpt!",20,35);

const texture = new THREE.CanvasTexture(ctx.canvas);
const planegeo = new THREE.PlaneGeometry( 5, 1 );
const planematerial = new THREE.MeshPhongMaterial( { map: texture } );

const planemesh = new THREE.Mesh( planegeo, planematerial );
scene.add( planemesh );
planemesh.position.set(0,0,-2);

camera.position.z = 5;


const mouse = new THREE.Vector2();


function mouseScroll(event) {
    camera.position.z = camera.position.z - 1;
}

//renderer.domElement.addEventListener( "wheel", mouseScroll );

const raycaster = new THREE.Raycaster();

var dummy = [planemesh];

function onMouseMove( event ) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function render() {

    for (let i = 0; i < mesh_arr_objs.length; i++) {
        mesh_arr_objs[i].rotation.x += 0.005;
        mesh_arr_objs[i].rotation.y += 0.005;
    }

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(dummy);

	if (intersects.length>0) {
        const a = 1;
	}
    else {
        planemesh.material.emissive.setHex( 0xff0000 );
    }
    texture.needsUpdate = true;
	renderer.render( scene, camera );
}

window.addEventListener( 'mousemove', onMouseMove);

function animate() {

    requestAnimationFrame( animate );
    render();
}

animate();