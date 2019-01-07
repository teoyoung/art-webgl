var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

// Effects 
//COMPOSER

var composer = new THREE.EffectComposer(renderer);
var renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);
//custom shader pass
var vertShader = document.getElementById('vertexShader').textContent;
var fragShader = document.getElementById('fragmentShader').textContent;
var counter = 0.0;
var myEffect = {
    uniforms: {
      "tDiffuse": { value: null },
      "amount": { value: counter }
    },
    vertexShader: vertShader,
    fragmentShader: fragShader
}

var customPass = new THREE.ShaderPass(myEffect);
customPass.renderToScreen = true;
composer.addPass(customPass);


// Convert to arr

const nPos = 0;
let run = false;

const form = CreatePositionArr( [ new THREE.BoxGeometry( 200, 200, 200, 40, 40, 40 ), new THREE.BoxGeometry( 100, 200, 100, 40, 40, 40 ) ] );

function CreatePositionArr( el ){
    positions = [];
    el.forEach(e => {
        let pos = ConvertToArr(e.vertices);
        positions.push(pos);
    });
    return positions;
}

function ConvertToArr( arr ){
    let position = [];
    arr.forEach(e => {
        position.push(e);
        e._rx = Math.random();
        e._ry = Math.random();
        e._rz = Math.random();
    });
    return position;
}




// Point cloude

var geometry = new THREE.Geometry();
var material = new THREE.PointsMaterial({
    size:2,
    vertexColors: THREE.VertexColors
});

for (let i = 0; i < form[nPos].length; i++) {
    var x = form[nPos][i].x;
    var y = form[nPos][i].y;
    var z = form[nPos][i].z;
    geometry.vertices.push( new THREE.Vector3( x, y , z));
    var color = Math.random();
    geometry.colors.push( new THREE.Color( color, color,  color ) );
}

let pointCloud = new THREE.Points( geometry, material );
scene.add(pointCloud);

// Animation 

function AnimCurve( start, end, t, random ){

    let middle = 90;

    if (random){
        X = (1-t)*random + t * 1
        t = t*X;
        middle = middle * random;
    }


    return Math.pow((1-t), 2) * start + 2 * (1 - t) * t * middle + Math.pow(t,2) * end;
}


let t = 0;

let start = 0;
let target = 1;

function animate() {

    if(t<1){

        t += 0.01;    

        for (let i = 0; i < geometry.vertices.length; i++) {

            geometry.vertices[i].x = AnimCurve( form[start][i].x, form[target][i].x, t, form[nPos + 1][i]._rx );
            geometry.vertices[i].y = AnimCurve( form[start][i].y, form[target][i].y, t, form[nPos + 1][i]._ry );
            geometry.vertices[i].z = AnimCurve( form[start][i].z, form[target][i].z, t, form[nPos + 1][i]._rz );

        }

    }



    geometry.verticesNeedUpdate = true;
    
    requestAnimationFrame( animate );

    pointCloud.rotation.y += 0.01;
    counter += 0.01;
    customPass.uniforms["amount"].value = counter;
    renderer.render( scene, camera );
    stats.update();
    composer.render();
}

animate();



function Run(){


    if (form.length - 1 === start){

        console.log('Назад');

        start = 0;
        target = 1;

    } else {

        start = 1;
        target = 0;

    }

    t = 0;
  
}

document.body.addEventListener('click', Run, false);

document.body.addEventListener("touchstart", Run, false);