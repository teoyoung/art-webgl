const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0';
document.body.appendChild(stats.domElement);
scene.background = new THREE.Color( 0x222222 );

let T_loader = new THREE.TextureLoader();

const contril_sis = true;
var controls;

if (contril_sis){
    controls = new THREE.OrbitControls( camera );
} else {
    camera.position.y = 30;
    camera.position.z = - 220;
    camera.lookAt(new THREE.Vector3(0,0,0));
}

 

// Shader 

var vertexShader = `
    precision mediump float;
    uniform float time;

    float random(float p) {
        return fract(sin(p)*10000.);
    }

    float noise(vec2 p) {
        return random(p.x + p.y*10000.);
    }

    vec2 sw(vec2 p) {return vec2( floor(p.x) , floor(p.y) );}
    vec2 se(vec2 p) {return vec2( ceil(p.x)  , floor(p.y) );}
    vec2 nw(vec2 p) {return vec2( floor(p.x) , ceil(p.y)  );}
    vec2 ne(vec2 p) {return vec2( ceil(p.x)  , ceil(p.y)  );}

    float smoothNoise(vec2 p) {
        vec2 inter = smoothstep(0., 1., fract(p));
        float s = mix(noise(sw(p)), noise(se(p)), inter.x);
        float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
        return mix(s, n, inter.y);
        return noise(nw(p));
    }

    float movingNoise(vec2 p) {
        float total = 0.0;
        total += smoothNoise(p     - time);
        total += smoothNoise(p*2.  + time) / 2.;
        total += smoothNoise(p*4.  - time) / 4.;
        total += smoothNoise(p*8.  + time) / 8.;
        total += smoothNoise(p*16. - time) / 16.;
        total /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
        return total;
    }

    float nestedNoise(vec2 p) {
        float x = movingNoise(p);
        float y = movingNoise(p + 100.);
        return movingNoise(p + vec2(x, y));
    }

    varying vec2 vUv;
    varying float cl_msk;
    varying float cl_pic;
    void main() {
        vUv = uv;
        float pct = distance(uv,vec2(0.5));

        float size = 20.;

        size += pct * 6.;

        vec2 p = vUv * size ;
        float brightness = nestedNoise(p);
        cl_msk = brightness;
        vec3 _Pos = vec3(position.x, position.y, position.z + 60.54 * brightness);
        _Pos.z += pct * 2800.;
        cl_pic = _Pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(_Pos,1.0);
    }
`;

let fragmentShader = `

    precision mediump float;

    varying vec2 vUv;
    varying float cl_msk;
    varying float cl_pic;
    void main() {

        float pct = distance(vUv,vec2(0.5));

        gl_FragColor.rgb = vec3(cl_msk);
        gl_FragColor.a = cl_msk * 0.3;
    }

`;

var shader = new THREE.ShaderMaterial( { 
    uniforms: {
        time: { type: "f", value: 0.1 }         
    },
    vertexShader: vertexShader, 
    fragmentShader:fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    wireframe:false
} );

var shader2 = new THREE.ShaderMaterial( { 
    uniforms: {
        time: { type: "f", value: 0.1 }         
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 _normal;
        void main() {
            vUv = uv;
            _normal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
    `, 
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 _normal;
        uniform float time;
        void main() {
            float time = sin(time);
            vec3 light = vec3(0.2, 0.3, 0.);
            light = normalize(light);

            float dProd = max(0.0,dot(_normal, light));
            float hor = max(0.0,dot(_normal, vec3(0.0, 0.8, 0.)));
            vec3 color = vec3(vUv.y * 0.53, vUv.y * 0.7, vUv.y);

            float t_color = smoothstep(_normal.y, 1., 0.4);
            float t_color2 = smoothstep(_normal.y, 1., 0.22);

            color = normalize(color + t_color);

            color += t_color2 * 0.9;

            color += dProd * 0.3;
            
            gl_FragColor = vec4(color, 1.);
        }
    `,
    side: THREE.BackSide,
    wireframe:false
} );


var geometry = new THREE.PlaneBufferGeometry( 8000, 8000, 500, 500 );
var material = new THREE.MeshBasicMaterial( {color: 0x222222, side: THREE.DoubleSide, transparente: true } );
var plane = new THREE.Mesh( geometry, shader );
plane.rotation.x = 90*Math.PI/180;
plane.position.y = 1000;
scene.add( plane );

var plane = new THREE.Mesh( geometry, material );
plane.rotation.x = 90*Math.PI/180;
plane.position.y = -400;
scene.add( plane );

var geometry = new THREE.SphereBufferGeometry( 4000, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.BackSide} );
var sphere = new THREE.Mesh( geometry, shader2 );
scene.add( sphere );



function animate() {
    
    if (contril_sis){
        controls.update();
    }

    shader.uniforms.time.value += 0.005;
    shader2.uniforms.time.value += 0.03;
	
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();

}

window.addEventListener( 'resize', onWindowResize, false );


function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


animate();