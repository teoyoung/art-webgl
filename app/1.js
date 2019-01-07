var groupCam = new THREE.Object3D();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 0.1, 20000 );

var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

var sphere = new THREE.Mesh( new THREE.SphereGeometry( 1, 5, 5 ), new THREE.MeshBasicMaterial( { color: 0xffff00, transparent:true, wireframe:true } ) );


var DrawPoint = function( e ){
    var starsGeometry = new THREE.Geometry();
    
    for ( var i = 0; i < e.geometry.vertices.length; i ++ ) {

        var star = new THREE.Vector3();
        star.x = e.geometry.vertices[i].x;
        star.y = e.geometry.vertices[i].y;
        star.z = e.geometry.vertices[i].z;

        starsGeometry.vertices.push( star );

    }

    var starsMaterial = new THREE.PointsMaterial( { size: 0.005, color: 0x888888 } );
    var starField = new THREE.Points( starsGeometry, starsMaterial );
    return starField;
    
}

var pnt = DrawPoint(sphere);

groupCam.add(pnt);
groupCam.position.y = -1.08;
groupCam.rotation.z = 90*Math.PI/180;
scene.add(groupCam);

var animate = function () {
    requestAnimationFrame( animate );
    groupCam.rotation.x += 0.01;
    renderer.render( scene, camera );
};

animate();