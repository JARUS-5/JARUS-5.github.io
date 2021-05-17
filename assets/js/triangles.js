import * as THREE from "./three.module.js";

function disposeArray() {
    this.array = null;
}

class RandomTriangles{
    constructor( x, y, z, nt, t_size, lmaterial, scene ){
        this.x = x;
        this.y = y;
        this.z = z;
        this.nt = nt;
        this.t_size = t_size;
        this.lmaterial = lmaterial;
        this.mesh_arr = [];
        this.scene = scene;
    }

    createTriangles(){
        const pA = new THREE.Vector3();
        const pB = new THREE.Vector3();
        const pC = new THREE.Vector3();

        const cb = new THREE.Vector3();
        const ab = new THREE.Vector3();

        for (let i = 0; i < this.nt; i++) {

            const geometry = new THREE.BufferGeometry();

            var positions = [];
            var normals = [];
            
            const ax = this.x + (Math.random()-0.5)*this.t_size;
            const ay = this.y + (Math.random()-0.5)*this.t_size;
            const az = this.z + (Math.random()-0.5)*this.t_size;

            const bx = this.x + (Math.random()-0.5)*this.t_size;
            const by = this.y + (Math.random()-0.5)*this.t_size;
            const bz = this.z + (Math.random()-0.5)*this.t_size;

            const cx = this.x + (Math.random()-0.5)*this.t_size;
            const cy = this.y + (Math.random()-0.5)*this.t_size;
            const cz = this.z + (Math.random()-0.5)*this.t_size;

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

            const mesh = new THREE.Mesh( geometry, this.lmaterial );
            mesh.position.set( this.x, this.y, this.z);
            mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation( -this.x, -this.y, -this.z ) );
            this.scene.add( mesh );

            this.mesh_arr.push( mesh );
        }
    }
}

export default RandomTriangles;