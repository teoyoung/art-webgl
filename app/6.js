const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

camera.position.z = 50;
camera.position.y = 50;

const obj_loader = new THREE.OBJLoader();
const t_loader = new THREE.TextureLoader()
const controls = new THREE.OrbitControls( camera );

const texture_uv = t_loader.load( 'asset/uv.jpg' );
texture_uv.wrapS = texture_uv.wrapT = THREE.RepeatWrapping;
texture_uv.repeat.set( 50, 50 );

const plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 5000, 5000, 32 ), new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, map: texture_uv } ) );
plane.rotation.x = 90*Math.PI/180;
scene.add( plane );

const positions = AddPositions( 50, 5, 15);

function AddPositions( px, pz, padding ){

    let p = [];

    for (let x = 0; x < px; x++) {    
        p.push(x * padding); //x
        p.push(0); //y
        p.push(0); //z

        for (let z = 0; z < pz; z++) {

            p.push(x * padding); //x
            p.push(0); //y
            p.push(z * padding); //z
            
        }
    }

    return new Float32Array(p);

}

var vertexShader = `
  precision highp float;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  attribute vec3 position;
  attribute vec3 newPosition;
  attribute vec2 uv;
  attribute vec3 instPos;
  varying vec2 vUv;

  varying vec3 vColor;
  varying vec3 vPos;


  void main() {
  
    vPos = instPos;
    vec4 worldPosition = projectionMatrix * vec4(instPos / 70., 1.0);
    vColor = abs(worldPosition.xyz) * 0.1;

    vec3 pf = vColor / vec3( abs(sin(time)), 0., 0.);

    vec3 np = vec3(position.x, position.y, position.z);   
    vec3 ep = vec3(newPosition.x, newPosition.y, newPosition.z); 
    
    vec3 morph = mix(np, ep, abs(sin(time * sin(instPos.x) + sin(instPos.z) )));
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( instPos + morph, 1.0 );
  }
`;

var fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D texture;
  varying vec3 vColor;
  uniform float time;
  varying vec3 vPos;

  float random(float p) {
    return fract(sin(p)*10000.);
  }
  
  float noise(vec2 p) {
    return random(p.x + p.y*10000.);
  }
  
  vec2 sw(vec2 p) {return vec2( floor(p.x) , floor(p.y) );}
  vec2 se(vec2 p) {return vec2( ceil(p.x)  , floor(p.y) );}
  vec2 nw(vec2 p) {return vec2( floor(p.x) , ceil(p.y)  );}
  vec2 ne(vec2 p) {return vec2( ceil(p.x)  , ceil(p.y)  );}
  
  float smoothNoise(vec2 p) {
    vec2 inter = smoothstep(0., 1., fract(p));
    float s = mix(noise(sw(p)), noise(se(p)), inter.x);
    float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
    return mix(s, n, inter.y);
    return noise(nw(p));
  }
  
  float movingNoise(vec2 p) {
    float total = 0.0;
    total += smoothNoise(p     - time);
    total += smoothNoise(p*2.  + time) / 2.;
    total += smoothNoise(p*4.  - time) / 4.;
    total += smoothNoise(p*8.  + time) / 8.;
    total += smoothNoise(p*16. - time) / 16.;
    total /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
    return total;
  }
  
  float nestedNoise(vec2 p) {
    float x = movingNoise(p);
    float y = movingNoise(p + 100.);
    return movingNoise(p + vec2(x, y));
  }



  void main() {

   
    // ring

    if (vColor.x > 0.0){
        discard;
    }

    
        
    vec4 t = texture2D(texture, vUv * 1.0);
    float b = 0.7;
    if (!gl_FrontFacing){   
        b = 0.4;
    }
    float brightness = nestedNoise(vColor.xz * 12.);
    //gl_FragColor = t * b * (brightness * 1.2); 
    gl_FragColor = t * b;
    //gl_FragColor = vec4(brightness, 0., 0., 1.0);


   //vec2 g = vColor.xz * 2.;
   //float k = 0.02 / abs(0.5 - length(g));   
   //gl_FragColor = vec4(vec3(k), 1.0);
   //gl_FragColor = vec4(vColor.x, 0., 0., 1.0);

  }
`;

console.log('fragmentShader', fragmentShader);

var shader = new THREE.RawShaderMaterial({
    uniforms: { 
        texture: { type: "t", value: t_loader.load( 'asset/tree.jpg', function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) }, 
        time: { type: "f", value: 0.0 }         
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side:THREE.DoubleSide,
    fog: true
});


const tree = {};


obj_loader.load(

    'asset/tree.obj', 

	function ( object ) {

        object.children.forEach(function( obj ) {

            obj.material = new THREE.MeshBasicMaterial( { color: 0x393939 } );

            console.log(tree);

            if( obj.name === 'tree' ){

                tree.obj = obj.geometry;

            } else if ( obj.name === 'tree_t' ){

                tree.target = obj.geometry.attributes.position.array;

            }

        });


        InstancedBuffer( tree );
        
        //scene.add( object );
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



function InstancedBuffer( obj ){

    let instanced = new THREE.InstancedBufferGeometry().copy(tree.obj);

    instanced.addAttribute("instPos", new THREE.InstancedBufferAttribute(new Float32Array(positions), 3, false ));
    console.log('from', tree.obj.attributes.position.array);
    console.log('target', tree.target);
    instanced.addAttribute("newPosition", new THREE.BufferAttribute(new Float32Array(tree.target), 3, false ));

    let mesh = new THREE.Mesh(instanced, shader);

    mesh.position.x = 0;
    mesh.position.z = 0;
    mesh.frustumCulled = false;
    console.log('mesh', mesh);

    scene.add(mesh);

}



let uii = document.getElementById('render');

function UIupd(){
    uii.innerHTML = renderer.info.render.triangles;
    
}





function animate() {

    shader.uniforms.time.value += 0.01;
    UIupd();
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
    stats.update();

}

animate();