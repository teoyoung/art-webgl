//Add control
var controls = new THREE.OrbitControls( camera );
controls.update();

let size = 50;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = size;
canvas.height = size;
canvas.classList.add('tempcanvas');
document.body.appendChild(canvas);


var images = ['asset/place.svg', 'asset/arrow.svg', 'asset/close.svg', ]

function loadImages(paths,whenLoaded){
    var imgs=[];
    paths.forEach(function(path){
      var img = new Image;
      img.onload = function(){
        imgs.push(img);
        if (imgs.length==paths.length) whenLoaded(imgs);
      }
      img.src = path;
    });
}


function fillUp( array, max ){
    var length = array.length;
    for (let i = 0; i < max - length; i++) {

        array.push(array[Math.floor(Math.random() * length )]);
        
    }
    return array;
}



function getArrayFromImage( img ){

    var imageCoords = [];
    ctx.clearRect(0,0,size, size);
    ctx.drawImage(img, 0, 0, size, size);
    

    let data = ctx.getImageData(0, 0, size, size);
    data = data.data;

    for(var y = 0; y < size; y++) {
        for(var x = 0; x < size; x++) {
          var red = data[((size * y) + x) * 4];
          var green = data[((size * y) + x) * 4 + 1];
          var blue = data[((size * y) + x) * 4 + 2];
          var alpha = data[((size * y) + x) * 4 + 3];
            if(alpha>0){
                imageCoords.push( [10 * (x - size/2), 10 * (size/2 - y )] );
            }
        }
    }

    return fillUp(imageCoords, 1500);
    
}


loadImages(images, function(loadImages){
    var gallery = [];
    loadImages.forEach(function(el, index){
        gallery.push(getArrayFromImage(loadImages[index]))
    });

    console.log(gallery);

var texture = new THREE.TextureLoader().load('particle.png');
var material = new THREE.PointsMaterial({
    size:10,
    vertexColors: THREE.VertexColors
});

geometry = new THREE.Geometry();



gallery[0].forEach((el, index)=>{
    geometry.vertices.push( new THREE.Vector3( el[0], el[1] , Math.random()*100));
    geometry.colors.push( new THREE.Color( Math.random(),  Math.random(),  Math.random() ) );
});

var pointCloud = new THREE.Points( geometry, material );
scene.add(pointCloud);



var i = 0;
var animate = function () {
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
};

animate();

var current = 0;
document.body.addEventListener('click', function(){
    current ++;
    current = current % gallery.length;
    geometry.vertices.forEach( function(particle, index){
        let tl = new TimelineMax();
        tl.to(particle, 1, { x:gallery[current][index][0], y:gallery[current][index][1] });
    });
})

});