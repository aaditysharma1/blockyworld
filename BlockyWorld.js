let g_worldPieces = [];
const SIZE = {
  x: 32,
  y: 10,
  z: 32
}
const MIN_Y = -1;
// https://stackoverflow.com/questions/8259479/should-i-synchronize-listener-notifications-or-not
// https://erkaman.github.io/wireframe-world/www/demo.html - insanely cool 
// https://www.sitepoint.com/building-earth-with-webgl-javascript/
const g_worldMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,6,6,1,1,1,1,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,6,6,1,1,1,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,6,6,1,1,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,6,6,1,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,6,6,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,6,6,1,1,1,1,6,1,1,1,1,6,6,6,6,6,6,6,6,6,6,6,6,6,1,1],
  [1,1,1,1,1,1,6,6,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,6,6,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,6,6,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,6,6,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,6,6,6,1,1,1,6,1,1,1,1,6,1,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,1,6,6,6,6,6,6,1,1,1,1,6,6,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,6,1,1,1,1,6,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,6,1,1,1,1,6,6,6,6,6,6,6,6,6],
  [1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,6],
]

function generateWorld() {
  const floor = new Cube(TEXTURES.COLOR, COLORS.GRAY);
  floor.setScale(SIZE.x, 0.001, SIZE.z);
  floor.setTranslate(0, MIN_Y, 0);
  g_worldPieces.push(floor);

  const sky = new Cube(TEXTURES.TEXTURE0);
  sky.setScale(1000, 1000, 1000);
  g_worldPieces.push(sky);

  const halfX = SIZE.x / 2;
  const halfZ = SIZE.z / 2;

  for(let x = 0; x < SIZE.x; x++) {
    for(let z = 0; z < SIZE.z; z++) {
      const height = g_worldMap[x][z];
      for(let y = 0; y < height; y++) {
        const block = new Cube(TEXTURES.TEXTURE1);
        block.setTranslate(x - halfX, y + MIN_Y, z - halfZ);
        block.setScale(1, 1, 1);
        g_worldPieces[getIndex(x, y, z)] = block;
      }
    }
  }
}

function getIndex(x, y, z) {
  return (z * SIZE.x * SIZE.y) + (y * SIZE.x) + x + 2;
}

function setBlock(x, y, z, texture) {
  if(!g_worldPieces[getIndex(x,y,z)]) {
    const block = new Cube(texture);
    block.setTranslate(x - (SIZE.x / 2), y + MIN_Y, z - (SIZE.z / 2));
    block.setScale(1, 1, 1);
    g_worldPieces[getIndex(x, y, z)] = block;
  }
}

function removeBlock(x, y, z) {
  g_worldPieces[getIndex(x, y, z)] = undefined;
}

function renderWorld() {
  g_worldPieces.forEach(cube => cube?.render());
}


var VSHADER_SOURCE = `
  precision mediump float;

  attribute vec4 a_Position;
  attribute vec2 a_UV;

  varying vec2 v_UV;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;


var FSHADER_SOURCE = `
  precision mediump float;
  
  varying vec2 v_UV;

  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_TextureChoice;

  void main() {
    if(u_TextureChoice == -1) {
      // Set to UV debug colors
      gl_FragColor = vec4(v_UV, 1, 1);
    } else if(u_TextureChoice == 0) {
      // Set to u_FragColor
      gl_FragColor = u_FragColor;
    } else if(u_TextureChoice == 1) {
      // Set to textures
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if(u_TextureChoice == 2) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if(u_TextureChoice == 3) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      // Set to error colors
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }
  }`;


const TEXTURES = {
  DEBUG: -1,
  COLOR: 0,
  TEXTURE0: 1,
  TEXTURE1: 2,
  TEXTURE2: 3
}


let canvas, gl;
let a_Position, a_UV, u_ModelMatrix, u_ViewMatrix, u_ProjectionMatrix;
let u_FragColor, u_Sampler0, u_Sampler1, u_Sampler2, u_TextureChoice; 


let g_VertexBuffer;
let g_UVBuffer;


let g_camera;
let g_cursorSpeed = 0.25;
let g_Invert = {'x': false, 'y': false};
const MOVEMENT_SPEEDS = {
  MOVE: 0.15,
  MOVE_ACCEL: 0.01,
  PAN: 2.5,
  PAN_ACCEL: 0.25
}
let isMoving = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
  leftPan: false,
  rightPan: false,
  upPan: false,
  downPan: false
};
let currentSpeeds = {
  z: 0,
  x: 0,
  y: 0,
  yPan: 0,
  xPan: 0
}


const g_startTime = performance.now() / 1000;
let g_time = performance.now();
let g_animTime = g_time / 1000 - g_startTime;


function setupWebGL() {
  canvas = document.getElementById('webgl');

  gl = canvas.getContext('webgl', {preserveDrawingBugger: true});
  if (!gl) {
    throw 'Failed to get the rendering context for WebGL';
  }


  gl.enable(gl.DEPTH_TEST);


  g_camera = new Camera();
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw 'Failed to intialize shaders.';
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    throw 'Failed to get the storage location of a_Position';
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    throw 'Failed to get the storage location of a_UV';
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    throw 'Failed to get the storage location of u_ModelMatrix';
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    throw 'Failed to get the storage location of u_ViewMatrix';
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    throw 'Failed to get the storage location of u_ProjectionMatrix';
  }

  gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, new Matrix4().elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, new Matrix4().elements);

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    throw 'Failed to get the storage location of u_FragColor';
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    throw 'Failed to get the storage location of u_Sampler0';
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    throw 'Failed to get the storage location of u_Sampler1';
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    throw 'Failed to get the storage location of u_Sampler2';
  }

  u_TextureChoice = gl.getUniformLocation(gl.program, 'u_TextureChoice');
  if (!u_TextureChoice) {
    throw 'Failed to get the storage location of u_TextureChoice';
  }

  g_VertexBuffer = gl.createBuffer();
  if (!g_VertexBuffer) {
    throw('Failed to create the Vertex buffer object');
  }

  g_UVBuffer = gl.createBuffer();
  if (!g_UVBuffer) {
    throw('Failed to create the UV buffer object');
  }

  return;
}

function initTextures() {
  loadAndBind(0, 'sky.png');
  loadAndBind(1, 'sand.png');
  loadAndBind(2, 'block.png');
}

function loadAndBind(index, imgSrc) {
  let img = new Image();
  if(!img) {
    throw 'Failed to create the image object';
  }

  img.onload = () => bindTexture(index, img);
  img.src = imgSrc;
}

function bindTexture(index, img) {
  let texture = gl.createTexture();
  if(!texture) {
    throw 'Failed to create the texture object';
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(getTexture(index));

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  gl.uniform1i(getSampler(index), index);
}

function getTexture(index) {
  switch(index) {
    case 0:
      return gl.TEXTURE0;
    case 1:
      return gl.TEXTURE1;
    case 2:
      return gl.TEXTURE2;
    default:
      return null;
  }
}

function getSampler(index) {
  switch(index) {
    case 0:
      return u_Sampler0;
    case 1:
      return u_Sampler1;
    case 2:
      return u_Sampler2;
    default:
      return null;
  }
}


function renderScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform4f(u_FragColor, COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2], COLORS.WHITE[3]);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  renderWorld();

  for(let i in g_bodyParts) {
    g_bodyParts[i].render();
  }
}

function setupUIListeners() {

  canvas.onclick = async () => { if( !document.pointerLockElement ) { await canvas.requestPointerLock(); } };
  document.addEventListener("pointerlockchange", () => {
    if(document.pointerLockElement === canvas) {
      document.onmousemove = (e) => rotateCam(e);
      document.onclick = (e) => {
        let blockPos = [];
        blockPos.push(Math.round(g_camera.at.elements[0]) + 16);
        blockPos.push(Math.round(g_camera.at.elements[1]) - MIN_Y);
        blockPos.push(Math.round(g_camera.at.elements[2]) + 16);

        if(e.button == 2) {
          setBlock(blockPos[0], blockPos[1], blockPos[2], TEXTURES.TEXTURE2);
        } else if(e.button == 0) {
          removeBlock(blockPos[0], blockPos[1], blockPos[2]);
        }
      }
    } else {
      document.onmousemove = null;
      document.onclick = null;
    }
  })

  document.onkeydown = (e) => handleKeys(e, true);
  document.onkeyup = (e) => handleKeys(e, false);

  document.getElementById("FOVSlide").addEventListener('input', function() { g_camera.fov = this.value; g_camera.resetPerspective(); sendTextToHTML(this.value, "FOV")});
  document.getElementById("MouseSlide").addEventListener('input', function() { g_cursorSpeed = this.value; });
  document.getElementById("xInv").addEventListener('input', function() { g_Invert['x'] = this.checked; });
  document.getElementById("yInv").addEventListener('input', function() { g_Invert['y'] = this.checked; });
}

function rotateCam(event) {
  if(g_Invert['x']) {
    g_camera.panLeft(event.movementX * g_cursorSpeed);
  } else {
    g_camera.panRight(event.movementX * g_cursorSpeed);
  }

  if(g_Invert['y']) {
    g_camera.panUp(event.movementY * g_cursorSpeed);
  } else {
    g_camera.panDown(event.movementY * g_cursorSpeed);
  }
}

function handleKeys(event, keyDown) {
  switch(event.code) {
    case "ArrowUp":
    case "KeyW":
      isMoving.forward = keyDown;
      break;
    case "ArrowDown":
    case "KeyS":
      isMoving.backward = keyDown;
      break;
    case "ArrowLeft":
    case "KeyA":
      isMoving.left = keyDown;
      break;
    case "ArrowRight":
    case "KeyD":
      isMoving.right = keyDown;
      break;
    case "Space":
      isMoving.up = keyDown;
      break;
    case "ShiftLeft":
    case "ShiftRight":
      isMoving.down = keyDown;
      break;
    case "KeyQ":
      isMoving.panLeft = keyDown;
      break;
    case "KeyE":
      isMoving.panRight = keyDown;
      break;
    case "KeyZ":
      isMoving.panUp = keyDown;
      break;
    case "KeyX":
      isMoving.panDown = keyDown;
      break;
    default:
      break;
  }
}

function handleMovement() {

  g_camera.moveForward(move(isMoving.forward, isMoving.backward, 'z', MOVEMENT_SPEEDS.MOVE, MOVEMENT_SPEEDS.MOVE_ACCEL));
  g_camera.moveRight(move(isMoving.right, isMoving.left, 'x', MOVEMENT_SPEEDS.MOVE, MOVEMENT_SPEEDS.MOVE_ACCEL));
  g_camera.moveUp(move(isMoving.up, isMoving.down, 'y', MOVEMENT_SPEEDS.MOVE, MOVEMENT_SPEEDS.MOVE_ACCEL));
  g_camera.panRight(move(isMoving.panRight, isMoving.panLeft, 'yPan', MOVEMENT_SPEEDS.PAN, MOVEMENT_SPEEDS.PAN_ACCEL));
  g_camera.panUp(move(isMoving.panUp, isMoving.panDown, 'xPan', MOVEMENT_SPEEDS.PAN, MOVEMENT_SPEEDS.PAN_ACCEL));
}


function move(positive, negative, speedIndex, maxSpeed, accel = Infinity) {

  let netDirection = 0;
  if(positive) {
    netDirection += 1;
  }
  if(negative) {
    netDirection -= 1;
  }
  
  let maxVelocity = netDirection * maxSpeed;

  if(maxVelocity < currentSpeeds[speedIndex]) {
    currentSpeeds[speedIndex] = (currentSpeeds[speedIndex] - accel < maxVelocity) ? maxVelocity : currentSpeeds[speedIndex] - accel;
  } else if(maxVelocity > currentSpeeds[speedIndex]) {
    currentSpeeds[speedIndex] = (currentSpeeds[speedIndex] + accel > maxVelocity) ? maxVelocity : currentSpeeds[speedIndex] + accel;
  }

  return currentSpeeds[speedIndex];
}


function resetUI() {
  document.getElementById("FOVSlide").value = g_camera.fov;
  sendTextToHTML(g_camera.fov, "FOV");

  document.getElementById("MouseSlide").value = g_cursorSpeed;

  document.getElementById("xInv").value = g_Invert['x'];
  document.getElementById("yInv").value = g_Invert['y'];
}


function tick() {

  const nowTime = performance.now();
  const duration = nowTime - g_time;
  const fps = 1000 / duration;
  if(fps < 10) {
    console.warn(fps);
  }
  sendTextToHTML(`ms: ${Math.floor(duration)}\tfps: ${Math.floor(fps)}`, "perf");

  g_time = nowTime;
  g_animTime = g_time / 1000 - g_startTime;

  if(g_isAnimating) {
    updateAnimationAngles();
  }

  handleMovement();

  renderScene();

  requestAnimationFrame(tick);
}

function sendTextToHTML(text, destination) {
  let elem = document.getElementById(destination);
  if(!elem) {
    console.error(`Failed to get ${destination}`);
    return;
  }
  elem.innerHTML = text;
}

function main() {
  try {
    setupWebGL();
    connectVariablesToGLSL();
    initTextures();
  } catch(e) {
    console.error(e);
    return;
  }
  setupUIListeners();
  resetUI();
  gl.clearColor(1, 0, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  generateWorld();
  generateHugeAnimal();
  requestAnimationFrame(tick);
}
