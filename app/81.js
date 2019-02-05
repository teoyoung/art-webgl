const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

const zoom = 1.2;

camera = new THREE.OrthographicCamera( window.innerWidth / - zoom, window.innerWidth / zoom, window.innerHeight / zoom, window.innerHeight / - zoom, 1, 100000 );
camera.position.z = 1000;
scene.background = new THREE.Color( 0xffffff );



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

let gC = new THREE.Group();

let tss = 0.5;
let scale_ = 0;

for( var j = 0; j < 2800*Math.PI/180; j += 20*Math.PI/180 ) {

    let gB = new THREE.Group();
    
    if ( j < 1800*Math.PI/180 ){
        scale_ += 0.005;
    } else {
        if (scale_ < 0.001){
            //scale_ = 0;
        } else {
           scale_ -= 0.01;
        }
        
    }       

    let cube = DrawEdgeFunction( 200, 8, 0.1 );
    cube.position.set( Math.cos( j ) * 100 * (j*0.2), Math.sin( j ) * 100 * (j*0.2),  0);
    cube.scale.set(scale_,scale_,scale_);
    cube.rotateX(tss);
    cube.rotateY(tss);
    cube.rotation.z += j ;

    gB.add( cube );
    gC.add( gB );

    tss += 0.001;

}

scene.add(gC);

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

    gC.rotation.z -= 0.7 / 2;

}

animate();