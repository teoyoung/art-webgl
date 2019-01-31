const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 100000 );
camera.position.z = 1000;
scene.background = new THREE.Color( 0xffffff );


// 
let edges = new THREE.EdgesGeometry( new THREE.BoxBufferGeometry( 2, 2, 2 ) );


let gC = new THREE.Group();

let time_s = 0;

let tss = 0;

for( var j = 0; j < 1800*Math.PI/180; j += 20*Math.PI/180 ) {

    

    if(time_s < 1){
        time_s += 0.1;
    } else {
        time_s = 0;
    }


    let gB = new THREE.Group();
    let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    line.position.set( Math.cos( j ) * 100 * (j*0.2), Math.sin( j ) * 100 * (j*0.2),  0);
    let sc = 1 * j;
    line.localpos = 1;
    let sv = line.position;
    line.scale.set(sc, sc,sc);
    line.rotation.z += j ;
    line.rotateY(tss);
    line.rotateX(tss);
    line.updateMatrix();
    //line.rotateOnAxis(j);

    gB.add( line );
    gC.add( gB );


    tss += 0.1;
}



scene.add(gC);

function intAnSoc( t ){
    return Math.pow(Math.abs(Math.sin(t)), 0.5)
}

// Animation
function InterAnim(s, f, t ){
    return (1-t)*s + t * f;
}

let time = 0;
let k = 0;

function animate() {

    if (time < 1){
        time += 0.0001;
    }

    k += 0.01;

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

    gC.children.forEach(function( e ) {
        /*
        
        e.children[0].rotation.y += 0.01;
        */
        //e.children[0].position.x += 0.1;

        /*

        if(e.children[0].localpos < 20){
            e.children[0].localpos += 0.05;
            e.children[0].translateX(1);
            e.children[0].rotateX(0.01);
            e.children[0].scale.set(e.children[0].localpos, e.children[0].localpos, e.children[0].localpos)
        } else {
            e.children[0].localpos = 1;
            console.log(e.children[0].position.x, e.children[0].savepos.x);
        }
        */

        
        
        

        //console.log(e.children[0].position.x);

        //var v1 = new THREE.Vector3( 0.6, 0, 0 );
        //e.children[0].translateOnAxis(v1, 0.4);
        //e.children[0].setRotationFromQuaternion(0.3);
        //e.children[0].rotateOnAxis();
        
    });

    //gC.rotation.z -= 18.5;
    gC.rotation.z -= 0.7 / 2;
    //console.log(k);
    

}

animate();