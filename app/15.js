const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
scene.background = new THREE.Color( 0x222222 );

contril_sis = true;

let vertexShader = `
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;

  attribute vec3 position;
  attribute vec2 uv;

  varying vec2 vUv;
    
  void main(){  
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
  }
  
`;

let fragmentShader = `
precision lowp float;

varying vec2 vUv;


  float line( float p, float uv ){
    return smoothstep(0.5 - p, 0.5, uv) - smoothstep(0.5, 0.5 + p, uv);
  } 

  vec2 greed( float size, vec2 uv, float p ){

    vec2 st = uv;

    st *= size;
    st = fract(st);
  
    float x = line(p, st.x);
    float y = line(p, st.y);

    return vec2( x, y);

  }

  void main(){

    float p = 0.012; // padding

    vec2 gr = greed(11.0, vUv, p * 2.);
    vec2 axis = greed(1.0, vUv, p / 2.);

    vec4 color = vec4(max(gr.x, gr.y)) * 0.5;



    gl_FragColor = color;
    gl_FragColor.r += axis.x;
    gl_FragColor.y += axis.y;


  }

`;

let material = new THREE.RawShaderMaterial({
  uniforms: { time: { type: "f", value: 1.}},
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true
});

var geometry = new THREE.PlaneBufferGeometry( 20, 20, 20 );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );



function animate() {
    
    if (contril_sis){
      controls.update();
    }

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

}
animate();