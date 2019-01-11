var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
var controls = new THREE.OrbitControls( camera );

// Shaders

let vertexShader = `
    precision highp float;

    attribute vec3 position;
    attribute vec2 source;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    uniform float size;
    uniform float blend;
    uniform sampler2D sourceTex;
    uniform vec2 dimensions;


    void main() {

        vec3 p = vec3(source,0.);

        p *= 1. / dimensions.x;

        vec4 mvPosition = modelViewMatrix * vec4( p, 1. );

                
        gl_PointSize = size * ( 1. / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;

    }

`;

let fragmentShader = `

    precision highp float;

    void main() {
        gl_FragColor = vec4(1.);   
    }

`;


function loadImages(paths,whenLoaded){
    var imgs=[];
    paths.forEach(function(path){
      var img = new Image;
      img.onload = function(){
        imgs.push(img);
        if (imgs.length===paths.length) whenLoaded(imgs);
      }
      img.src = path;
    });
}

let images = ['asset/img1.jpg', 'asset/img2.jpg'];

let obj = [];
images.forEach(img => {
    obj.push({ file:img });
});

console.log('obj', obj);
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

loadImages(images, function( loadImages){

    obj.forEach((image, index) => {
        
        let img = loadImages[index];       
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.id = "prew"
        ctx.drawImage(img,0,0);
        //document.body.appendChild(canvas);

        let data = ctx.getImageData(0,0, canvas.width, canvas.height); 
        let buffet = data.data;

        let rgb = [];
        let c =  new THREE.Color();

        for (let i = 0; i < buffet.length; i = i+4) {
            
            c.setRGB( buffet[i], buffet[i+1], buffet[i+2]);
            rgb.push({ c:c.clone(), id: i/4 });

        }

        let result = new Float32Array( img.width * img.height );
        let j = 0;
        rgb.forEach(e => {
            result[j] = e.id % img.width;
            result[j + 1] = Math.floor(e.id / img.height);
            j = j + 2;
        });

        console.log(result, 'result');

        obj[index].image = img;
        obj[index].texture = new THREE.Texture(img);
        obj[index].buffer = result;
        obj[index].texture.needUpdate = true;
        obj[index].texture.flipY = false;

    });

    console.log(obj);

    let w = loadImages[0].width;
    let h = loadImages[0].height;

    let position = new Float32Array(w*h*3);
    let index = 0;

    for (let i = 0; i < w; i++) {
    
        for (let j = 0; j < h; j++) {

            position[index * 3] = j;
            position[index * 3 + 1] = i;
            position[index * 3 + 2] = 0;

            index++;
            
        }
        
    }

    let geometry = new THREE.BufferGeometry();

    geometry.addAttribute( 'position', new THREE.BufferAttribute( position, 3 ) );
    geometry.addAttribute( 'source', new THREE.BufferAttribute( obj[0].buffer, 2 ) );

    var material = new THREE.RawShaderMaterial({    
        uniforms: { sourceTex: { type: "t", value: obj[0].texture },
                    blend: { type: "f", value: 0.0 },
                    size: { type: "f", value: 2.1 },
                    dimensions: { type: "v2", value: new THREE.Vector2(w, h) }
        },
        vertexShader: vertexShader, 
        fragmentShader: fragmentShader
    });

    let points = new THREE.Points( geometry, material );
    scene.add(points);
    console.log(scene);
});





function animate() {

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
    stats.update();

}

animate();