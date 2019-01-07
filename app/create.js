// Менеджер загрузок: запускаем анимации только тогда, когда загрузились все объекты
var manager = new THREE.LoadingManager();

// Анимация
var mixers = [];
var clock = new THREE.Clock();

// Загрузчики
var FBXloader = new THREE.FBXLoader(manager);
var T_loader = new THREE.TextureLoader(manager);

var setting = {
    camera: {
        x: 350,
        y: 250,
        z: 0
    },
    player: {
        speed: 1.0,
        rotat: 0.07,
    },
    worldSize: 1.0,
    models: {
        path:'res/'
    }
};



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 200000 );
    camera.position.set( setting.camera.x, setting.camera.y, setting.camera.z );

var controls = new THREE.OrbitControls( camera );

var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

renderer.render( scene, camera );