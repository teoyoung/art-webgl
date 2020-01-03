const vShader = `
  attribute vec2 a_position;     
  attribute vec2 a_uv;   
  uniform vec2 u_resolution;  
  varying vec2 v_uv;
  varying vec2 v_resolution;
  void main() {
    
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_resolution = zeroToOne;
    v_uv = a_uv;
  }
`;
const fShader = `
  precision mediump float;   
  varying vec2 v_uv; 
  uniform sampler2D u_image1;
  uniform sampler2D u_image2;
  uniform sampler2D u_brd;
  uniform float u_time;  
  uniform float u_move; 
  varying vec2 v_resolution;

  float recMask(float move){
    float iy = step(0.2 + move, v_resolution.y) - step(0.5 +  move, v_resolution.y);
    float ix = step(0.1, v_resolution.x);
    float xx = iy + ix;
    return ix;
  }

  void main() {
    vec4 bg_1 = texture2D(u_image1, vec2(v_uv.x + u_time, v_uv.y));
    vec4 bg_2 = texture2D(u_image2, vec2(v_uv.x + u_time / 2., v_uv.y));

    // bird
    vec2 bUv = vec2(v_uv.x * 2., v_uv.y * 2.);
    float bmv = u_time * 0.2;
    if(u_move == 1.){
      bmv -= 0.1;
      bmv *= -1.;
    }


    vec2 mv = vec2(0, u_move);
    float rctms = recMask(bmv);
    vec4 mixbg = mix(bg_2, bg_1, bg_1.a);
    // vec4 addBird = mix(mixbg, u_brd, u_brd.a);
    
    // vec4(vec3(rctms), 1.)
    gl_FragColor = vec4(vec3(rctms), 1.);

  }
`;

const canvas = document.getElementById("canvas");
const cntx = canvas.getContext("webgl");
Resize();
const vertexShader = CreateShader(cntx, cntx.VERTEX_SHADER, vShader);
const fragmentShader = CreateShader(cntx, cntx.FRAGMENT_SHADER, fShader);
const program = CreateProgram(cntx, vertexShader, fragmentShader);
// 
cntx.useProgram(program);

let time = 0.5; 
let move = 0;
let textures = [];
let go_txt = [];

Images(["asset/bg.jpg", "asset/bg.png", "asset/brd.png"], setTextures );

function setTextures( maps ){
  for (let i = 0; i < maps.length; i++) {    
    let texture = cntx.createTexture();
    cntx.bindTexture(cntx.TEXTURE_2D, texture);
    go_txt.push(texture);
  
    cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_WRAP_S, cntx.REPEAT);
    cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_WRAP_T, cntx.REPEAT);
    cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_MIN_FILTER, cntx.NEAREST);
    cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_MAG_FILTER, cntx.NEAREST);
    cntx.texImage2D(cntx.TEXTURE_2D, 0, cntx.RGBA, cntx.RGBA, cntx.UNSIGNED_BYTE, maps[i]); 
  }
  DrawRectangle(512, 512, lal, 0.8);
}


animation();
function animation(){  
    cntx.clear(cntx.COLOR_BUFFER_BIT);  
    time += 0.0025;
    DrawRectangle(512, 512, time, move);
    requestAnimationFrame(animation);
}

function Images(urls, callback){
  let lenght = urls.length;

  var loaderImage = function() {
    --lenght;
    if (lenght == 0) {
      callback(textures);
    }
  };

  for (var i = 0; i < lenght; ++i) {
    var image = LoadedImage(urls[i], loaderImage);
    textures.push(image);
  }

}


function LoadedImage(url, callback){
  let image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}



function DrawRectangle( width, heigh, time, jump ){

  let positionAttribute = cntx.getAttribLocation(program, "a_position");
  let uv = cntx.getAttribLocation(program, "a_uv");
  let resolutionUniform = cntx.getUniformLocation(program, "u_resolution");
  let localResolution = cntx.getUniformLocation(program, "u_loc_resolution");
  let u_time = cntx.getUniformLocation(program, "u_time");
  let u_jump = cntx.getUniformLocation(program, "u_move");
  let u_image0 = cntx.getUniformLocation(program, "u_image0");
  let u_image1 = cntx.getUniformLocation(program, "u_image1");
  let u_image2 = cntx.getUniformLocation(program, "u_brd");

  let positionBuffer = cntx.createBuffer();
  let texCoordBuffer = cntx.createBuffer();

  cntx.uniform2f(resolutionUniform, cntx.canvas.width, cntx.canvas.height);
  cntx.uniform2f(localResolution, width, heigh);
  cntx.uniform1f(u_time, time);
  cntx.uniform1f(u_jump, jump);  
  cntx.uniform1i(u_image0, 0);  // texture unit 0
  cntx.uniform1i(u_image1, 1);  // texture unit 1
  cntx.uniform1i(u_image2, 2);  // texture unit 1

  cntx.bindBuffer(cntx.ARRAY_BUFFER, texCoordBuffer);
  cntx.bufferData(cntx.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,]), cntx.STATIC_DRAW);
  cntx.enableVertexAttribArray(uv);
  cntx.vertexAttribPointer(uv, 2, cntx.FLOAT, false, 0, 0);

  let x1 = 0;
  let x2 = x1 + width;
  let y1 = 0;
  let y2 = y1 + heigh;

  cntx.bindBuffer(cntx.ARRAY_BUFFER, positionBuffer);
  cntx.bufferData(cntx.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), cntx.STATIC_DRAW);

  cntx.enableVertexAttribArray(positionAttribute);
  cntx.vertexAttribPointer(positionAttribute, 2, cntx.FLOAT, false, 0, 0); 

  cntx.activeTexture(cntx.TEXTURE0);
  cntx.bindTexture(cntx.TEXTURE_2D, go_txt[0]);
  cntx.activeTexture(cntx.TEXTURE1);
  cntx.bindTexture(cntx.TEXTURE_2D, go_txt[1]);
  cntx.activeTexture(cntx.TEXTURE2);
  cntx.bindTexture(cntx.TEXTURE_2D, go_txt[2]);

  cntx.drawArrays(cntx.TRIANGLES, 0, 6); 

}

function Resize(){
  let displayWidth  = canvas.clientWidth;
  let displayHeight = canvas.clientHeight;
  
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
  cntx.viewport(0, 0, cntx.canvas.width, cntx.canvas.height);
}

function CreateShader(gl, type, source){
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader); 
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {                      
      return shader;
  }
  gl.deleteShader(shader);
}

function CreateProgram (gl, _vertexShader, _fragmentShader){
  let program = gl.createProgram();
  gl.attachShader(program, _vertexShader);
  gl.attachShader(program, _fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
      return program;
  }   
  gl.deleteProgram(program);

}



document.addEventListener('mousedown', function(event) {
  _jump -= 0.25;
}, false);


document.addEventListener('keydown', function(event) {
  move = 1;
}, false);

document.addEventListener('keyup', function(event) {
  move = 0;
}, false);

 

document.addEventListener('dblclick', function(event) {
  _jump -= 0.40;
}, false);



// document.addEventListener('touchstart', function(event) {
//   _jump -= 0.25;
// }, false);

