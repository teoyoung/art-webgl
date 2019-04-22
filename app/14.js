const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
scene.background = new THREE.Color( 0x222222 );

let T_loader = new THREE.TextureLoader();
const obj_loader = new THREE.OBJLoader();

const contril_sis = false;
var controls;
camera.position.z = 10;
if (contril_sis){
    controls = new THREE.OrbitControls( camera );
} else {
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0,0,0));
}

var config = {
  zoom: 0
};

var gui = new dat.GUI();
gui.add(config, 'zoom', 0, 1).listen();

let vertexShader = `
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;

  attribute vec3 position;
  attribute vec3 position2;
  attribute vec3 normal2;
  attribute vec2 uv;
    
  varying vec2 vUv;

  void main(){  
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(mix(position, position2, time), 1.0 );
  }
  
`;

let fragmentShader = `

  uniform float time;

  precision mediump float;

  uniform sampler2D map_1;
  uniform sampler2D map_2;

  varying vec2 vUv;

  void main(){
    vec4 map_1 = texture2D( map_1, vUv );
    vec4 map_2 = texture2D( map_2, vUv );
    vec4 fin = mix(map_1, map_2, 0.5);
    gl_FragColor = fin;
  }

`;
//mix(position2, position, abs(sin(time))
//
let materials = {
  "material": new THREE.MeshBasicMaterial({ color:0xffffff, map: new THREE.TextureLoader().load( "asset/morph/material.jpg" )  }),
  "morph": new THREE.RawShaderMaterial({
    uniforms: { 
      time: { type: "f", value: config.zoom },
      map_1: { type: "t", value: new THREE.TextureLoader().load( "asset/morph/morph.jpg" ) },
      map_2: { type: "t", value: new THREE.TextureLoader().load( "asset/morph/morph_.jpg" ) }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
}

var loader = new THREE.ObjectLoader();

loader.load( "asset/morph.json",
	function ( obj ) {

    obj.children.forEach(e => {
      console.log("----", e.geometry.attributes);
      if (e.children.length === 1){
        e.geometry.addAttribute('position2', new THREE.BufferAttribute( new Float32Array( e.children[0].geometry.attributes.position.array ), 3 ) );
        e.geometry.addAttribute('normal2', new THREE.BufferAttribute( new Float32Array( e.children[0].geometry.attributes.normal.array ), 3 ) );
        e.children[0].position.x = 5;
        e.remove(e.children[0]);
      }
      e.material = materials[e.name]; 
    });	
    //scene.add(obj); 
	},
);


obj_loader.load(
  'asset/morph.obj', 
function ( object ) {
      object.children.forEach(function( obj ) {
          obj.material = new THREE.MeshBasicMaterial( { color: 0x393939 } );
      });   
      scene.add( object );
  }
);


var loader333 = new THREE.FBXLoader();
loader333.load( 'asset/morph2.fbx', function ( object ) {

  object.children.forEach(function( e ) {

    if (e.children.length === 1){
      e.geometry.addAttribute('position2', new THREE.BufferAttribute( new Float32Array( e.children[0].geometry.attributes.position.array ), 3 ) );
      e.remove(e.children[0]);
    }

    e.material = materials[e.name]; 

  }); 

  console.log("Hello!");
  console.log(object);
  let sc = 0.01;
  object.scale.set( sc, sc, sc );
  scene.add( object );
} );

let x = 0;

function animate() {
    x += 0.02;
    materials.morph.uniforms.time.value = config.zoom;
    
    if (contril_sis){
        controls.update();
    } else {
      camera.position.x = Math.sin(x) * 2;
      camera.position.z = Math.cos(x) * 2;
      camera.lookAt(new THREE.Vector3(0,3,0));
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