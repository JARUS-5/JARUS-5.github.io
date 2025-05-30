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
            var colors = [];
            
            // Add some variation to triangle sizes
            const sizeVariation = 0.8 + Math.random() * 0.4;
            
            const ax = this.x + (Math.random()-0.5)*this.t_size * sizeVariation;
            const ay = this.y + (Math.random()-0.5)*this.t_size * sizeVariation;
            const az = this.z + (Math.random()-0.5)*this.t_size * sizeVariation;

            const bx = this.x + (Math.random()-0.5)*this.t_size * sizeVariation;
            const by = this.y + (Math.random()-0.5)*this.t_size * sizeVariation;
            const bz = this.z + (Math.random()-0.5)*this.t_size * sizeVariation;

            const cx = this.x + (Math.random()-0.5)*this.t_size * sizeVariation;
            const cy = this.y + (Math.random()-0.5)*this.t_size * sizeVariation;
            const cz = this.z + (Math.random()-0.5)*this.t_size * sizeVariation;

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

            // Add vertex colors for more visual interest
            const color = new THREE.Color();
            const hue = Math.random() * 0.1; // Small hue variation
            const saturation = 0.5 + Math.random() * 0.5; // Saturation variation
            const lightness = 0.4 + Math.random() * 0.3; // Lightness variation
            
            color.setHSL(hue, saturation, lightness);
            
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);

            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
            geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).onUpload( disposeArray ) );

            // Create a clone of the material to allow for individual triangle color variations
            const materialClone = this.lmaterial.clone();
            materialClone.vertexColors = true;
            
            // Add some shininess variation
            materialClone.shininess = 30 + Math.random() * 50;
            
            const mesh = new THREE.Mesh( geometry, materialClone );
            mesh.position.set( this.x, this.y, this.z);
            mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation( -this.x, -this.y, -this.z ) );
            
            // Add random initial rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            this.scene.add( mesh );
            this.mesh_arr.push( mesh );
        }
    }
}

export default RandomTriangles;