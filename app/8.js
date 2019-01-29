const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

camera.position.z = 200;
scene.background = new THREE.Color( 0xffffff );


// 
let edges = new THREE.EdgesGeometry( new THREE.BoxBufferGeometry( 30, 30, 30 ) );



let gC = new THREE.Group();

for( var j = 0; j < 360*Math.PI/180; j += 30*Math.PI/180 ) {
    let gB = new THREE.Group();
    let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    line.position.set( Math.cos( j ) * 100, Math.sin( j ) * 100,  0);
    line.rotation.z = j ;
    console.log(line);

    //line.rotateOnAxis(j);

    gB.add( line );
    gC.add( gB );
}


console.log(gC.children[0].children[0]);
scene.add(gC);


var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}



// Animation
function InterAnim(s, f, t ){
    return (1-t)*s + t * f;
}

let time = 0;

function animate() {

    if (time < 1){
        time += 0.01;
    }

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

    gC.children.forEach(function( e ) {
        /*
        e.children[0].rotation.x += 0.01;
        e.children[0].rotation.y += 0.01;
        */
        //e.children[0].position.x += 0.1;
        e.children[0].translateX( 1);
        //e.children[0].setRotationFromQuaternion(0.3);
        var xAxis = new THREE.Vector3(0,1,0);
        rotateAroundObjectAxis(e.children[0], xAxis, Math.PI / 180);
        //e.children[0].rotateOnAxis();
        
    });

    //gC.rotation.z += 0.01;
    

}

animate();