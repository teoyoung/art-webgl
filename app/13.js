var scene, camera, controls, pointLight, stats;
var composer, renderer, mixer;

var params = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0
};

var clock = new THREE.Clock();
var container = document.getElementById( 'container' );

stats = new Stats();
container.appendChild( stats.dom );

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
container.appendChild( renderer.domElement );

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 100000 );
camera.position.set( - 5, 2.5, - 3.5 );
scene.add( camera );

controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 1;
controls.maxDistance = 10;

scene.add( new THREE.AmbientLight( 0x404040 ) );

pointLight = new THREE.PointLight( 0xffffff, 1 );
camera.add( pointLight );

var renderScene = new THREE.RenderPass( scene, camera );

var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.renderToScreen = true;
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

composer = new THREE.EffectComposer( renderer );
composer.setSize( window.innerWidth, window.innerHeight );
composer.addPass( renderScene );
composer.addPass( bloomPass );

var geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var gui = new dat.GUI();

gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

  renderer.toneMappingExposure = Math.pow( value, 4.0 );

} );

gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

  bloomPass.threshold = Number( value );

} );

gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

  bloomPass.strength = Number( value );

} );

gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

  bloomPass.radius = Number( value );

} );

window.onresize = function () {

  var width = window.innerWidth;
  var height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize( width, height );
  composer.setSize( width, height );

};


function animate() {

  requestAnimationFrame( animate );

  const delta = clock.getDelta();

  mixer.update( delta );

  stats.update();

  composer.render();

}