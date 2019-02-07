const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

const zoom = 1.2;

camera = new THREE.OrthographicCamera( window.innerWidth / - zoom, window.innerWidth / zoom, window.innerHeight / zoom, window.innerHeight / - zoom, 1, 100000 );
camera.position.z = 1000;
scene.background = new THREE.Color( 0xffffff );

let edges = new THREE.EdgesGeometry( new THREE.BoxBufferGeometry( 2, 2, 2 ) );

let gC = new THREE.Group();

let tss = 0.5;
let scale_ = 0;

for( var j = 0; j < 2800*Math.PI/180; j += 20*Math.PI/180 ) {

    let gB = new THREE.Group();
    
    if ( j < 1800*Math.PI/180 ){
        scale_ += 0.4;
    } else {
        if (scale_ < 0.001){
            //scale_ = 0;
        } else {
           scale_ -= 1.2;
        }
        
    }       
    
    let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    line.position.set( Math.cos( j ) * 100 * (j*0.2), Math.sin( j ) * 100 * (j*0.2),  0);
    let sv = line.position;
    line.scale.set(scale_, scale_,scale_);
    line.rotation.z += j ;
    line.rotateY(tss);
    line.rotateX(tss);

    gB.add( line );
    gC.add( gB );

    tss += 0.1;

}

scene.add(gC);

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

    gC.rotation.z -= 0.7 /2;

}

window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize() {
    camera.left = window.innerWidth / - zoom;
    camera.right =  window.innerWidth / zoom;
    camera.top = window.innerHeight / zoom;
    camera.bottom = window.innerHeight / - zoom;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


animate();