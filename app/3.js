var controls = new THREE.OrbitControls( camera );

var texture = new THREE.TextureLoader().load('particle.png');
var material = new THREE.PointsMaterial({
    size:10,
    vertexColors: THREE.VertexColors
});

geometry = new THREE.Geometry();

var minR = 200;

for (let i = 0; i < 500; i++) {
    var x,y,z;
    if ( i < minR){
        x = Math.sin( i ) * minR;
        y = Math.cos( i ) * minR;

    } else {
        x = Math.sin( i ) * i;
        y = Math.cos( i ) * i;
        
    }
    z = i * 1.5;
    geometry.vertices.push( new THREE.Vector3( x, y , z));
    geometry.colors.push( new THREE.Color( Math.random(), Math.random(),  0 ) );
}

console.log( geometry.vertices[0]);

var pointCloud = new THREE.Points( geometry, material );
scene.add(pointCloud);


var g = 0;

function animate() {
    g++;
	requestAnimationFrame( animate );

    geometry.vertices.forEach( function(el, i){
        var dX, dY, dZ;
        dX = Math.sin(g/10 + i/10);
        dY = 0;
        dZ = 0;
        el.add(new THREE.Vector3(dX, dY, dZ));
    });

    pointCloud.rotation.z = g / 100;

    controls.update();
    geometry.verticesNeedUpdate = true;

	renderer.render( scene, camera );

}

animate();