const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
scene.background = new THREE.Color( 0x222222 );

let T_loader = new THREE.TextureLoader();
const obj_loader = new THREE.OBJLoader();


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
  
  uniform sampler2D snow;
  uniform sampler2D dif;
  uniform float time;

  varying vec2 vUv;
  varying vec3 u_normal;

  float snow_mask( vec3 pos, vec3 normal ){

    float form = max(0.0, dot(normal, normalize(pos)));
    return pow(form, mix(0.8, 10., abs(sin(time))));

  }
  

  void main() { 

    vec3 show_origin = vec3(5., 30, 10);
    float mask = snow_mask(show_origin, u_normal);  

    vec4 snow = texture2D( snow, vUv * 2. ); 
    vec4 dif = texture2D( dif, vUv ); 

    vec3 color = mix( dif.rgb, snow.rgb, mask); 

    gl_FragColor = vec4(color * dif.a, 1.0);   

  }

`;



var material = new THREE.RawShaderMaterial({    
  uniforms: { 
    time: { type: "f", value: 0.0 }, 
    snow: { value: new THREE.TextureLoader().load( "./asset/snow.jpg", function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) },
    dif: { value: new THREE.TextureLoader().load( "./asset/snow_map.png", function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) } 
}, 
  vertexShader: vertexShader, 
  fragmentShader: fragmentShader
});

var material2 = new THREE.RawShaderMaterial({    
  uniforms: { 
    time: { type: "f", value: 0.0 }, 
    snow: { value: new THREE.TextureLoader().load( "./asset/snow.jpg", function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) },
    dif: { value: new THREE.TextureLoader().load( "./asset/dif.jpg", function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) } 
}, 
  vertexShader: vertexShader, 
  fragmentShader: `

  precision highp float;
  
  uniform sampler2D snow;
  uniform sampler2D dif;
  uniform float time;

  varying vec2 vUv;
  varying vec3 u_normal;

  float snow_mask( vec3 pos, vec3 normal ){

    float form = max(0.0, dot(normal, normalize(pos)));
    return pow(form, mix(0.8, 10., abs(sin(time))));

  }
  

  void main() { 

    vec3 show_origin = vec3(5., 30, 10);
    float mask = snow_mask(show_origin, u_normal);  

    vec4 snow = texture2D( snow, vUv * 2. ); 
    vec4 dif = texture2D( dif, vUv * 2.); 

    vec3 color = mix( dif.rgb, snow.rgb, mask); 

    gl_FragColor = vec4(color, 1.0);   

  }

`
});



var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 60, 32, 32 ), material2 );
sphere.position.x = 120;
sphere.position.z = 220;
scene.add( sphere );

var cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 60, 60, 60 ), material2 );
cube.position.x = 220;
cube.position.z = 220;
scene.add( cube );










obj_loader.load(

  'asset/snow.obj', 

function ( object ) {

      object.children.forEach(function( obj ) {

          obj.material = material;

          console.log(obj);

      });

      object.scale.set(3.0, 3.0, 3.0);
      
      scene.add( object );
  },
  
function ( xhr ) {
      
      if(xhr.loaded / xhr.total * 100 === 100){
          console.log('Загрузка');
      }

},
// called when loading has errors
function ( error ) {

  console.log( 'An error happened' );

}
);

function animate() {

    
    if (contril_sis){
        controls.update();
    }

    material.uniforms.time.value += 0.01;
    material2.uniforms.time.value += 0.01;

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