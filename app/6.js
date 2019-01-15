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

const positions = AddPositions( 50, 50, 15);

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
  void main() {
    vec3 morph = mix(position, newPosition, abs(sin(time * sin(instPos.x) + sin(instPos.z) )));
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( instPos + morph, 1.0 );
  }
`;

var fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D texture;
  void main() {
    vec4 t = texture2D(texture, vUv * 1.0);
    float b = 0.7;
    if (!gl_FrontFacing){   
        b = 0.4;
    }
    gl_FragColor = t * b ;   
  }
`;

var shader = new THREE.RawShaderMaterial({
    uniforms: { texture: { type: "t", value: t_loader.load( 'asset/tree.jpg', function(e){ e.wrapS = e.wrapT = THREE.RepeatWrapping } ) }, time: { type: "f", value: 0.0 } },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side:THREE.DoubleSide
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

    var mesh = new THREE.Mesh(instanced, shader);

    mesh.position.x = 0;
    mesh.position.z = 0;

    scene.add(mesh);

}








function animate() {

    shader.uniforms.time.value += 0.01;

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
    stats.update();

}

animate();