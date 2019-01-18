const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);

camera.position.z = 50;
camera.position.y = 50;

const t_loader = new THREE.TextureLoader()
const controls = new THREE.OrbitControls( camera );

var vertexShader = `
    varying vec3 vNormal;
    varying vec4 vPos;
    void main() {
        vPos = projectionMatrix * vec4(position, 1.0);
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;

let fragmentShader = `
    uniform float time;
    varying vec4 vPos;
    varying vec3 vNormal;
    void main() {

        float mask = vPos.x + sin(time) * 7.;

        if (mask < 0.){
            discard;
        }

        vec3 light = vec3(-0.5, 1.2, 1.0);
        vec3 light2 = vec3(0.5, -1.2, -1.0);

        light = normalize(light);
        light2 = normalize(light2);

        float dProd = max(0.0, dot(vNormal, light));
        float dProd2 = max(0.0, dot(vNormal, light2));
        float d = mix(dProd,dProd2, 0.5);
        float power = 2.;     
              
        gl_FragColor = vec4(d * power, d * power, d * power, 1.0);

    }

`;

var shader = new THREE.ShaderMaterial( { 
    uniforms: {
        time: { type: "f", value: 0.0 }         
    },
    vertexShader: vertexShader, 
    fragmentShader: fragmentShader,
    side:THREE.DoubleSide, 
} );

var vertexShader2 = `
    varying vec3 vNormal;
    varying vec4 vPos;
    void main() {
        vPos = projectionMatrix * vec4(position, 1.0);
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;

let fragmentShader2 = `
    uniform float time;
    varying vec4 vPos;
    varying vec3 vNormal;
    void main() {

        float mask = vPos.x + sin(time) * 7.;

        if (mask > 0.){
            discard;
        }

        vec3 light = vec3(-0.5, 1.2, 1.0);
        vec3 light2 = vec3(0.5, -1.2, -1.0);

        light = normalize(light);
        light2 = normalize(light2);

        float dProd = max(0.0, dot(vNormal, light));
        float dProd2 = max(0.0, dot(vNormal, light2));
        float d = mix(dProd,dProd2, 0.5);
        float power = 2.;     
              
        gl_FragColor = vec4(d * power, d * power, d * power, 1.0);

    }

`;

var shader2 = new THREE.ShaderMaterial( { 
    uniforms: {
        time: { type: "f", value: 0.0 }         
    },
    vertexShader: vertexShader2, 
    fragmentShader: fragmentShader2,
    side:THREE.DoubleSide, 
} );

var cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 10, 10, 10 ), shader );
scene.add( cube );

var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 7, 32, 32 ), shader2 );
scene.add( sphere );


function animate() {

    shader.uniforms.time.value += 0.01;
    shader2.uniforms.time.value += 0.01;

    requestAnimationFrame( animate );

    controls.update();

    renderer.render( scene, camera );

    stats.update();

}

animate();