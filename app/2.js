//Add control
var controls = new THREE.OrbitControls( camera );
controls.update();

var texture = new THREE.TextureLoader().load('particle.png');
var material = new THREE.PointCloudMaterial({
    size:10,
    vertexColors: THREE.VertexColors
});

geometry = new THREE.Geometry();

for (var i = 0; i < 1; i++){
    x = 0;
    y = 0;
    z = 0;

    geometry.vertices.push( new THREE.Vector3( x, y , z));
    geometry.colors.push( new THREE.Color( Math.random(),  Math.random(),  Math.random() ) );
}

var pointCloud = new THREE.PointCloud( geometry, material );
scene.add(pointCloud);












var animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();

    renderer.render( scene, camera );
};

animate();