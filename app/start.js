var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1.0, 20000 );


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let contril_sis = false;
var controls = new THREE.OrbitControls( camera );
if (contril_sis){
} else {
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0,0,0));
}

//

let t_loader = new THREE.TextureLoader();
let g_loader = new THREE.ObjectLoader();
