var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
var controls = new THREE.OrbitControls( camera );

camera.position.z = 50;

const positions = [];
let start = 0;
let target = 1;


var vertexShader = `
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  attribute vec3 position;
  attribute vec3 position2;
  attribute vec3 position3;
  attribute vec3 normal;

  uniform float time;

  #define PI 3.1415926538

  void main() {

    float l = abs(sin(time * PI));
    float X = (1.0-l)*0.0 + l * 0.5;
    vec3 _Pos = mix(position, position2, abs(sin(X * PI)));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(_Pos, 1.0);

    if (_Pos.y < 5.0){
      gl_PointSize = 5.0 * _Pos.z * _Pos.x;
    } else {
      gl_PointSize = 1.0;
    }

    
  }
`;

var fragmentShader = `

  precision highp float;

  void main() {
    gl_FragColor = vec4(1.0);   
  }
`;

var material = new THREE.RawShaderMaterial({    
  uniforms: { time: { type: "f", value: 0.0 } }, 
  vertexShader: vertexShader, 
  fragmentShader: fragmentShader
});

var geometry = new THREE.BufferGeometry();
var loader = new THREE.OBJLoader();

// load a resource
loader.load(
	// resource URL
	'asset/dance.obj',
	// called when resource is loaded
	function ( object ) {

        object.children.forEach(function(element) {
            console.log(element);
            positions.push(element.geometry.attributes.position.array);
        });

        console.log(positions);

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions[start], 3 ) );
        geometry.addAttribute( 'position2', new THREE.BufferAttribute( positions[target], 3 ) );
        //var mesh = new THREE.Mesh( geometry, material );
        var mesh = new THREE.Points( geometry, material );
        scene.add( mesh );
	},
	// called when loading is in progresses
	function ( xhr ) {

        console.log('Загрузка в процессе');
        
        if(xhr.loaded / xhr.total * 100 === 100){

            let df =['1', '2', '3'];

            console.log(df);
        }

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);





function Recalc(){
  

  
  if( start === positions.length || start > positions.length){
    //console.log('Пересчитал старт');
    start = 0;
  }

  if( target === positions.length || target > positions.length){
    //console.log('Пересчитал конец');
    target = 1;
  }
  
}

let t = 0;
let max = 0.5;
let min = 0.5;

Number.prototype.rounded= function(i){ 
  i= Math.pow(10, i || 15); 
  return Math.round(this*i)/i; 
}

var rounded = function(number){
  return +number.toFixed(2);
}

function animate() {

    let l = Math.abs(Math.sin(t * Math.PI));
    let X = (1.0-l)*0.0 + l * 0.5;


    if( rounded(X) === 3 ){
      //console.log('Очистка');
      t = 0;
    }
    
    let c = Math.abs(Math.sin(rounded(t) * Math.PI)).rounded();

    if (c === 1){
      start += 2;
      Recalc();
      //geometry.addAttribute( 'position', new THREE.BufferAttribute( positions[start], 3 ) );
    } else if (c === 0){
      target += start + 1;
      Recalc();
      //geometry.addAttribute( 'position2', new THREE.BufferAttribute( positions[target], 3 ) );
    }

    material.uniforms.time.value += 0.008;

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
    stats.update();

    t += 0.05;

}

animate();