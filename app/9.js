const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
scene.background = new THREE.Color( 0xffffff );

let T_loader = new THREE.TextureLoader();

const contril_sis = false;
var controls;

if (contril_sis){
    controls = new THREE.OrbitControls( camera );
} else {
    camera.position.y = 30;
    camera.position.z = - 220;
    camera.lookAt(new THREE.Vector3(0,0,0));
}

 

// Shader 

var vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;

let fragmentShader = `

    uniform float angle;
    varying vec2 vUv;
    uniform sampler2D map;

    void main() {
        float step = 0.25;
        vec2 vUv = vec2(vUv.x / 4., vUv.y);
        if(angle > 90.){
            vUv.x += step;
        }
        if(angle > 180.){
            vUv.x += step;
        }
        if(angle > 270.){
            vUv.x += step;
        }
        if(angle > 360.){
            vUv.x += step;
        }

        vec4 map = texture2D(map, vUv);
        gl_FragColor = map;
    }

`;

var shader = new THREE.ShaderMaterial( { 
    uniforms: {
        map: { type: "t", value: T_loader.load("./asset/tree/t.jpg", function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) },
        cam: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
        angle: { type: "f", value: 0.0 }         
    },
    vertexShader: vertexShader, 
    fragmentShader: fragmentShader
} );



let cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 50, 50, 50 ), shader );
//let cube = new THREE.Mesh( new THREE.CylinderGeometry( 30, 30, 60, 32 ), shader );
//cube.rotation.x = 90*Math.PI/180;
scene.add( cube );

let point = new THREE.Mesh( new THREE.BoxBufferGeometry( 10, 10, 10 ), new THREE.MeshBasicMaterial( {color: 0xff0000} ) );
let point_pos_ang = 0*Math.PI/180;
let point_distance = 180;
point.position.x = Math.sin(point_pos_ang) * point_distance;
point.position.z = Math.cos(point_pos_ang) * point_distance;
scene.add( point );


function animate() {
    camera.lookAt(new THREE.Vector3(0,0,0));
    console.clear();
    if(point_pos_ang > 360*Math.PI/180){
        point_pos_ang = 0 * Math.PI/180;
    } else {
        point_pos_ang  += 0.01;
    }
    
    if (contril_sis){
        controls.update();
    }
	
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

    camera.position.x = Math.sin(point_pos_ang) * point_distance;
    camera.position.z = Math.cos(point_pos_ang) * point_distance;

    console.log('angle', camera.position.x);
    

    shader.uniforms.angle.value = point_pos_ang / Math.PI * 180;
    //cube.lookAt(camera.position);

}

window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


animate();