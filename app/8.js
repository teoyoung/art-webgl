const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

const zoom = 1.2;

camera = new THREE.OrthographicCamera( window.innerWidth / - zoom, window.innerWidth / zoom, window.innerHeight / zoom, window.innerHeight / - zoom, 1, 100000 );
camera.position.z = 1000;
scene.background = new THREE.Color( 0xffffff );



let object = DrawEdgeFunction( 200, 10, 0.5 );
scene.add(object);

function DrawEdgeFunction( lenght, width, size ){

    let ln = lenght / 2;   

    let elements = new THREE.Object3D();

    let drawEdge = [
        { x:0, y:-ln, z:-ln, rx:0, ry:0, rz:0 }, { x:0, y:-ln, z:ln, rx:0, ry:0, rz:0 },
        { x:0, y:ln, z:-ln, rx:0, ry:0, rz:0 }, { x:0, y:ln, z:ln, rx:0, ry:0, rz:0 },
        { x:ln, y:0, z:-ln, rx:0, ry:0, rz:90, lenght: true }, { x:-ln, y:0, z:-ln, rx:0, ry:0, rz:90, lenght: true },
        { x:ln, y:0, z:ln, rx:0, ry:0, rz:90, lenght: true }, { x:-ln, y:0, z:ln, rx:0, ry:0, rz:90, lenght: true },
        { x:ln, y:-ln, z:0, rx:0, ry:90, rz:0, lenght: true }, { x:ln, y:ln, z:0, rx:0, ry:90, rz:0, lenght: true },
        { x:-ln, y:-ln, z:0, rx:0, ry:90, rz:0, lenght: true }, { x:-ln, y:ln, z:0, rx:0, ry:90, rz:0, lenght: true }
    ];    

    drawEdge.forEach(function( e ) {

        let lenghtEdge = lenght;

        if(e.lenght){
            lenghtEdge = lenght * 0.015 + lenght;
        }        

        var cube = new THREE.Mesh( new THREE.BoxBufferGeometry( lenghtEdge, width, width ), new THREE.MeshBasicMaterial( {color: 0x000000} ) );
        cube.position.set(e.x, e.y, e.z);
        cube.rotation.set(e.rx *Math.PI/180, e.ry*Math.PI/180, e.rz*Math.PI/180);
        elements.add( cube );

    });

    elements.scale.set(size, size, size);

    return elements;

}




let edges = new THREE.EdgesGeometry( new THREE.BoxBufferGeometry( 2, 2, 2 ) );


let gC = new THREE.Group();

let time_s = 0;

let tss = 0.5;
let scale_ = 0;

for( var j = 0; j < 2800*Math.PI/180; j += 20*Math.PI/180 ) {


    
    if ( j < 1800*Math.PI/180 ){
        scale_ += 0.005;
    } else {
        if (scale_ < 0.01){
            scale_ = 0;
        } else {
           scale_ -= 0.022;
           console.log(scale_);
        }
        
    }       

    if(time_s < 1){
        time_s += 0.01;
    } else {
        time_s = 0;
    }

    let cube = DrawEdgeFunction( 200, 8, 0.1 );
    cube.position.set( Math.cos( j ) * 100 * (j*0.2), Math.sin( j ) * 100 * (j*0.2),  0);
    cube.scale.set(scale_,scale_,scale_);
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.1;
    //cube.rotateX(1.1);

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
    //line.rotateOnAxis(j);

    gB.add( line );
    gC.add( cube );

    tss += 0.0001;

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

    object.rotateY(0.1);
    object.rotateX(0.1);

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