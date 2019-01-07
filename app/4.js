var controls = new THREE.OrbitControls( camera );

var startForm = new THREE.BoxGeometry( 200, 200, 200, 50, 50, 50 );
var endForm = new THREE.BoxGeometry( 800, 800, 800, 50, 50, 50 );
var ed = endForm.vertices;
var geometry = new THREE.Geometry();
var material = new THREE.PointsMaterial({
    size:10,
    vertexColors: THREE.VertexColors
});

console.log(startForm.vertices.length);

for (let i = 0; i < startForm.vertices.length; i++) {
    var x = startForm.vertices[i].x;
    var y = startForm.vertices[i].y;
    var z = startForm.vertices[i].z;

    geometry.vertices.push( new THREE.Vector3( x, y , z));
    geometry.colors.push( new THREE.Color( Math.random(), Math.random(),  Math.random() ) );
}

var pointCloud = new THREE.Points( geometry, material );
scene.add(pointCloud);

var i = 0;
function animate() {
    i ++;
    requestAnimationFrame( animate );
    
    geometry.vertices.forEach( function(particle, index){
        var dX, dY, dZ;
        dX = Math.sin(i/10 + index/2) * 2;
        dY = 0;
        dZ = 0;
        particle.add(new THREE.Vector3(dX, dY, dZ));
    });
    geometry.verticesNeedUpdate = true;
    controls.update();
	renderer.render( scene, camera );
}

animate();


document.body.addEventListener('click', function(){
    geometry.vertices.forEach( function(particle, i){
        let tl = new TimelineMax();        
        tl.to(particle, 1, { x:ed[i].x, y:ed[i].y, z:ed[i].z });
    });
});
