const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
scene.background = new THREE.Color( 0x222222 );

let T_loader = new THREE.TextureLoader();

const contril_sis = true;
var controls;

if (contril_sis){
    controls = new THREE.OrbitControls( camera );
} else {
    camera.position.y = 30;
    camera.position.z = - 220;
    camera.lookAt(new THREE.Vector3(0,0,0));
}


var vertexShader = `
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 normal;

  varying vec2 vUv;
  varying vec3 u_normal;

  void main() {
    vUv = uv;
    u_normal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  }
`;

var fragmentShader = `

  precision highp float;

  uniform sampler2D mask;
  uniform sampler2D snow;
  uniform sampler2D dif;
  uniform float time;

  varying vec2 vUv;
  varying vec3 u_normal;

  float snow_mask( vec3 pos, vec3 normal, float power ){

    return max(0.0, dot(normal, normalize(pos))) * power;

  }
  

  void main() { 

    vec3 show_origin = vec3(-10.5, 30.2, 1.0);
    float mask = snow_mask(show_origin, u_normal, 1.);  

    vec4 snow = texture2D( snow, vUv * 2. ); 
    vec4 dif = texture2D( dif, vUv * 2. ); 

    vec3 color = mix( dif.rgb, snow.rgb, mask); 

    gl_FragColor = vec4(color, 1.0);   

  }

`;



var material = new THREE.RawShaderMaterial({    
  uniforms: { 
    time: { type: "f", value: 0.0 }, 
    mask: { value: new THREE.TextureLoader().load( "./asset/crl.png" ) },
    snow: { value: new THREE.TextureLoader().load( "./asset/snow.jpg", function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) },
    dif: { value: new THREE.TextureLoader().load( "./asset/dif.jpg", function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) } 
}, 
  vertexShader: vertexShader, 
  fragmentShader: fragmentShader
});



var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 120, 32, 32 ), material );
scene.add( sphere );

var cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 150, 150, 150 ), material );
cube.position.x = 220;
scene.add( cube );

function animate() {

    
    if (contril_sis){
        controls.update();
    }

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

}

window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


animate();