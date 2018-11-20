//Add control
var controls = new THREE.OrbitControls( camera );
controls.update();

var texture = new THREE.TextureLoader().load('particle.png');
var material = new THREE.PointCloudMaterial({
    size:10,
    vertexColors: THREE.VertexColors
});

geometry = new THREE.Geometry();










var animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();

    renderer.render( scene, camera );
};

animate();