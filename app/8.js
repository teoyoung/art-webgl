const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

const zoom = 1.3;

camera = new THREE.OrthographicCamera( window.innerWidth / - zoom, window.innerWidth / zoom, window.innerHeight / zoom, window.innerHeight / - zoom, 1, 100000 );
camera.position.z = 1000;
scene.background = new THREE.Color( 0xffffff );



let object = DrawEdgeFunction();
scene.add(object);

function DrawEdgeFunction(){

    let elements = new THREE.Group();
    let drawEdge = [
        { x:0, y:-50, z:-50, rx:0, ry:0, rz:0 }, { x:0, y:-50, z:50, rx:0, ry:0, rz:0 },
        { x:0, y:50, z:-50, rx:0, ry:0, rz:0 }, { x:0, y:50, z:50, rx:0, ry:0, rz:0 },
        { x:50, y:0, z:-50, rx:0, ry:0, rz:90, lenght: true }, { x:-50, y:0, z:-50, rx:0, ry:0, rz:90, lenght: true },
        { x:50, y:0, z:50, rx:0, ry:0, rz:90, lenght: true }, { x:-50, y:0, z:50, rx:0, ry:0, rz:90, lenght: true },
        { x:50, y:-50, z:0, rx:0, ry:90, rz:0, lenght: true }, { x:50, y:50, z:0, rx:0, ry:90, rz:0, lenght: true },
        { x:-50, y:-50, z:0, rx:0, ry:90, rz:0, lenght: true }, { x:-50, y:50, z:0, rx:0, ry:90, rz:0, lenght: true }
    ];    

    drawEdge.forEach(function( e ) {

        let lenghtEdge = 100;

        if(e.lenght){
            lenghtEdge = 110;
        }        

        var cube = new THREE.Mesh( new THREE.BoxBufferGeometry( lenghtEdge, 10, 10 ), new THREE.MeshBasicMaterial( {color: 0x000000} ) );
        cube.position.set(e.x, e.y, e.z);
        cube.rotation.set(e.rx *Math.PI/180, e.ry*Math.PI/180, e.rz*Math.PI/180);
        elements.add( cube );

    });
    return elements;
}




let edges = new THREE.EdgesGeometry( new THREE.BoxBufferGeometry( 2, 2, 2 ) );


let gC = new THREE.Group();

let time_s = 0;

let tss = 0;
let scale_ = 0;

for( var j = 0; j < 2800*Math.PI/180; j += 20*Math.PI/180 ) {



    if ( j < 1600*Math.PI/180 ){
        scale_ += 0.5;
    } else {
        if (scale_ < 0.1){
            scale_ = 0;
        } else {
            scale_ -= 1.0;
        }
        
    }   
    

    if(time_s < 1){
        time_s += 0.1;
    } else {
        time_s = 0;
    }

    let obj = DrawEdgeFunction();

    let gB = new THREE.Group();
    let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    line.position.set( Math.cos( j ) * 100 * (j*0.2), Math.sin( j ) * 100 * (j*0.2),  0);
    let sc = 1 * j;
    line.localpos = 1;
    let sv = line.position;
    line.scale.set(scale_, scale_,scale_);
    line.rotation.z += j ;
    line.rotateY(tss);
    line.rotateX(tss);
    line.updateMatrix();
    //line.rotateOnAxis(j);

    gB.add( line );
    gC.add( gB );


    tss += 0.09;
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

    object.rotation.x += 0.01;
    object.rotation.y += 0.01;

    if (time < 1){
        time += 0.0001;
    }

    k += 0.01;

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();


    //gC.rotation.z -= 18.5;
    gC.rotation.z -= 0.7 / 2;
    //console.log(k);


}

animate();