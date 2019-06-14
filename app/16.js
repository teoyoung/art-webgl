const vShader = `
  attribute vec2 a_position;     
  attribute vec2 a_uv;   
  uniform vec2 u_resolution;  
  varying vec2 v_uv;
  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_uv = a_uv;
  }
`;
const fShader = `
  precision mediump float;   
  varying vec2 v_uv; 
  uniform sampler2D u_image;   
  void main() {
    gl_FragColor = texture2D(u_image, v_uv);
  }
`;

const canvas = document.getElementById("canvas");
const cntx = canvas.getContext("webgl");
Resize();
const vertexShader = CreateShader(cntx, cntx.VERTEX_SHADER, vShader);
const fragmentShader = CreateShader(cntx, cntx.FRAGMENT_SHADER, fShader);
const program = CreateProgram(cntx, vertexShader, fragmentShader);

cntx.useProgram(program);

const image = new Image();
image.crossOrigin = "anonymous";
image.src = "asset/uv.jpg";
image.onload = function() {
  DrawRectangle(image.width, image.height, image);
};



function DrawRectangle( width, heigh, img ){

  let texture = cntx.createTexture();
  let positionAttribute = cntx.getAttribLocation(program, "a_position");
  let resolutionUniform = cntx.getUniformLocation(program, "u_resolution");
  let uv = cntx.getAttribLocation(program, "a_uv");

  let positionBuffer = cntx.createBuffer();
  let texCoordBuffer = cntx.createBuffer();

  cntx.uniform2f(resolutionUniform, cntx.canvas.width, cntx.canvas.height);

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


  cntx.bindTexture(cntx.TEXTURE_2D, texture);

  cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_WRAP_S, cntx.CLAMP_TO_EDGE);
  cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_WRAP_T, cntx.CLAMP_TO_EDGE);
  cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_MIN_FILTER, cntx.NEAREST);
  cntx.texParameteri(cntx.TEXTURE_2D, cntx.TEXTURE_MAG_FILTER, cntx.NEAREST);

  cntx.texImage2D(cntx.TEXTURE_2D, 0, cntx.RGBA, cntx.RGBA, cntx.UNSIGNED_BYTE, img);  

  cntx.drawArrays(cntx.TRIANGLES, 0, 6); 

}

function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
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

