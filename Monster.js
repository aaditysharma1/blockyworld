class Shape {

  //
  //https://github.com/ChrisTs8920/3D-dog-WebGL
  // example minecraft implementations were good inspiration
  constructor(textureType = TEXTURES.DEBUG, color = COLORS.WHITE, origin = [0.5, 0.5, 0.5], baseMatrix) {
    this.type = undefined;
    this.origin = origin;
    this.textureType = textureType;
    this.color = color;
    
    this.matrix = baseMatrix?.type === "cube" 
      ? new Matrix4(baseMatrix.matrix)
      : new Matrix4(baseMatrix || undefined);
      
    if (baseMatrix?.type === "cube") {
      baseMatrix.children.push(this);
    }

    this.translations = [0, 0, 0];
    this.rotations = [0, 0, 0];
    this.scaleVals = [1, 1, 1];
    this.children = [];
  }

  translate(tx = 0, ty = 0, tz = 0, saveVals = true) {
    if (saveVals) {
      this.translations[0] += tx;
      this.translations[1] += ty;
      this.translations[2] += tz;
    }
    this.matrix.translate(tx, ty, tz);
    this.propagate();
  }

  rotateX(deg = 0, saveVal = true) {
    if (saveVal) this.rotations[0] += deg;
    this.matrix.rotate(deg, 1, 0, 0);
    this.propagate();
  }

  rotateY(deg = 0, saveVal = true) {
    if (saveVal) this.rotations[1] += deg;
    this.matrix.rotate(deg, 0, 1, 0);
    this.propagate();
  }

  rotateZ(deg = 0, saveVal = true) {
    if (saveVal) this.rotations[2] += deg;
    this.matrix.rotate(deg, 0, 0, 1);
    this.propagate();
  }

  scale(sx = 1, sy = 1, sz = 1) {
    this.scaleVals[0] *= sx;
    this.scaleVals[1] *= sy;
    this.scaleVals[2] *= sz;
    this.propagate();
  }

  setTranslate(tx = 0, ty = 0, tz = 0) {
    const [dx, dy, dz] = [
      tx - this.translations[0],
      ty - this.translations[1],
      tz - this.translations[2]
    ];
    this.matrix.translate(dx, dy, dz);
    this.translations = [tx, ty, tz];
    this.propagate();
  }

  setRotateX(deg = 0) {
    this.matrix.rotate(deg - this.rotations[0], 1, 0, 0);
    this.rotations[0] = deg;
    this.propagate();
  }

  setRotateY(deg = 0) {
    this.matrix.rotate(deg - this.rotations[1], 0, 1, 0);
    this.rotations[1] = deg;
    this.propagate();
  }

  setRotateZ(deg = 0) {
    this.matrix.rotate(deg - this.rotations[2], 0, 0, 1);
    this.rotations[2] = deg;
    this.propagate();
  }

  setScale(sx = 1, sy = 1, sz = 1) {
    this.scaleVals = [sx, sy, sz];
    this.propagate();
  }

  propagate() {
    this.children.forEach(child => child.update(this.matrix));
  }

  update(newBase) {
    this.matrix = new Matrix4(newBase);
    this.translate(this.translations[0], this.translations[1], this.translations[2], false);
    this.rotateX(this.rotations[0], false);
    this.rotateY(this.rotations[1], false);
    this.rotateZ(this.rotations[2], false);
  }

  render() {
    throw "Called render on abstract Shape class";
  }
}

class Cube extends Shape {
  constructor(textureType = TEXTURES.DEBUG, color = COLORS.WHITE, origin = [0.5, 0.5, 0.5], baseMatrix) {
    super(textureType, color, origin, baseMatrix);
    this.type = "cube";
  }

  render() {
    gl.uniform1i(u_TextureChoice, this.textureType);
    gl.uniform4f(u_FragColor, ...this.color);

    const newMat = new Matrix4(this.matrix);
    newMat.scale(...this.scaleVals);
    gl.uniformMatrix4fv(u_ModelMatrix, false, newMat.elements);

    const [ox, oy, oz] = this.origin;
    const vertices = [
      // Back face
      [0-ox, 0-oy, 0-oz, 1-ox, 0-oy, 0-oz, 1-ox, 1-oy, 0-oz],
      [0-ox, 0-oy, 0-oz, 0-ox, 1-oy, 0-oz, 1-ox, 1-oy, 0-oz],
      // Front face
      [1-ox, 0-oy, 1-oz, 0-ox, 0-oy, 1-oz, 0-ox, 1-oy, 1-oz],
      [1-ox, 0-oy, 1-oz, 1-ox, 1-oy, 1-oz, 0-ox, 1-oy, 1-oz],
      // Top face
      [0-ox, 1-oy, 0-oz, 0-ox, 1-oy, 1-oz, 1-ox, 1-oy, 1-oz],
      [0-ox, 1-oy, 0-oz, 1-ox, 1-oy, 0-oz, 1-ox, 1-oy, 1-oz],
      // Bottom face
      [0-ox, 0-oy, 1-oz, 0-ox, 0-oy, 0-oz, 1-ox, 0-oy, 0-oz],
      [0-ox, 0-oy, 1-oz, 1-ox, 0-oy, 1-oz, 1-ox, 0-oy, 0-oz],
      // Left side
      [0-ox, 0-oy, 1-oz, 0-ox, 0-oy, 0-oz, 0-ox, 1-oy, 0-oz],
      [0-ox, 0-oy, 1-oz, 0-ox, 1-oy, 1-oz, 0-ox, 1-oy, 0-oz],
      // Right side
      [1-ox, 0-oy, 0-oz, 1-ox, 0-oy, 1-oz, 1-ox, 1-oy, 1-oz],
      [1-ox, 0-oy, 0-oz, 1-ox, 1-oy, 0-oz, 1-ox, 1-oy, 1-oz]
    ].flat();

    const uv = Array(12).fill([0,0, 1,0, 1,1]).flat();
    
    drawTriangles(vertices, uv);
  }
}

function drawCube(matrix = new Matrix4()) {
  new Cube(COLORS.WHITE, [0.5, 0.5, 0.5], matrix).render();
}

function drawTriangles(vertices, uv) {
  const NUM_VERTICES = vertices.length / 3;
  const vertData = new Float32Array(vertices);
  const uvData = new Float32Array(uv);
  const FSIZE = uvData.BYTES_PER_ELEMENT;

  gl.bindBuffer(gl.ARRAY_BUFFER, g_VertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertData, gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  if (uv) {
    gl.bindBuffer(gl.ARRAY_BUFFER, g_UVBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);
  }

  gl.drawArrays(gl.TRIANGLES, 0, NUM_VERTICES);
}

const CELL_SIZE = 0.2; // Grid cell size for scaling

const COLORS = {
  WHITE: [0.8, 0.8, 0.8, 1.0],
  OFF_WHITE: [0.6, 0.6, 0.6, 1.0],
  BLUE_WHITE: [0.3, 0.4, 0.5, 1.0],
  BLUE_GRAY: [0.2, 0.3, 0.5, 1.0],
  CYAN_GRAY: [0.3, 0.4, 0.4, 1.0],
  BLACK: [0.0, 0.0, 0.0, 1.0],
  ORANGE: [0.8, 0.3, 0.0, 1.0],
  GRAY: [0.2, 0.2, 0.2, 1.0],
};

let g_isAnimating = true;
let g_mouthOpening = false;

let g_bodyParts = {};
let g_animal = [0, 0, 0];
let g_neck = [0, 0];
let g_mouth = 0;
let g_flippers = { left: [0, 0, 0], right: [0, 0, 0] };
let g_tail = {
  body: [0, 0],
  front: [0, 0],
  rear: [0, 0],
  flap: [0, 0],
};
let g_flukes = { left: 0, right: 0 };
let g_pos = [7, 1.5, -10];

function scaleToGraph(part) {
  part.scale(CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function generateHugeAnimal() {
  function createPart(parent, color, scale, offset, rotation = []) {
    let part = new Cube(TEXTURES.COLOR, color, [0.5, 0.5, 0.5], parent);
    part.scale(...scale);
    scaleToGraph(part);
    part.translate(...offset.map((o) => o * CELL_SIZE));
    if (rotation.length) {
      part.rotateX(rotation[0] || 0);
      part.rotateY(rotation[1] || 0);
      part.rotateZ(rotation[2] || 0);
    }
    return part;
  }

  let bodyFront = createPart(null, COLORS.OFF_WHITE, [40, 70, 40], g_pos, [0, 0, 90]);
  g_bodyParts["bodyFront"] = bodyFront;

  let bodyRear = createPart(bodyFront, COLORS.OFF_WHITE, [40.001, 70, 40], [0, 25, 0], g_tail.body);
  g_bodyParts["bodyRear"] = bodyRear;

  let head = createPart(bodyFront, COLORS.WHITE, [25, 40, 25], [0, -25, 0], g_neck);
  g_bodyParts["head"] = head;

  g_bodyParts["leftEye"] = createPart(head, COLORS.BLACK, [6, 6, 6], [1, -7.5, -12.5]);
  g_bodyParts["rightEye"] = createPart(head, COLORS.BLACK, [6, 6, 6], [1, -7.5, 12.5]);

  g_bodyParts["mouthBack"] = createPart(head, COLORS.WHITE, [5, 35, 4], [0, 0, -8]);
  g_bodyParts["mouthTop"] = createPart(head, COLORS.WHITE, [2.5, 35, 23], [0, -8, -5]);

  let jaw = createPart(head, COLORS.OFF_WHITE, [2.5, 30, 23], [-7.5, 0, -5], [g_mouth]);
  g_bodyParts["jaw"] = jaw;

  function createFlipper(side, offset, rotation) {
    let flipper = createPart(
      bodyFront,
      COLORS.WHITE,
      [5, 40, 15],
      [-12.5, offset, 10],
      [0, -25, ...g_flippers[side]]
    );
    g_bodyParts[`${side}Flipper`] = flipper;
  }

  createFlipper("left", -30, [-25, ...g_flippers.left]);
  createFlipper("right", 30, [25, ...g_flippers.right]);

  let frontTail = createPart(bodyRear, COLORS.BLUE_WHITE, [40, 45, 40], [0, 50, 0], g_tail.front);
  g_bodyParts["frontTail"] = frontTail;

  let rearTail = createPart(frontTail, COLORS.BLUE_WHITE, [25, 30, 35], [0, 45, 0], g_tail.rear);
  g_bodyParts["rearTail"] = rearTail;

  let flukeBase = createPart(rearTail, COLORS.CYAN_GRAY, [5, 5, 35], [0, 35, 0], g_tail.fluke);
  g_bodyParts["flukeBase"] = flukeBase;

  function createFluke(side, offset, rotation) {
    let fluke = createPart(flukeBase, COLORS.CYAN_GRAY, [2.5, 40, 20], [0, offset, 20], [g_flukes[side]]);
    g_bodyParts[`${side}Fluke`] = fluke;

    let flukeFront = createPart(fluke, COLORS.CYAN_GRAY, [2.5, 40, 20], [0, -offset * 2, -3], [0, rotation]);
    g_bodyParts[`${side}FlukeFront`] = flukeFront;
  }

  createFluke("left", -5, -50);
  createFluke("right", 5, 50);

  // Add animation logic
  let angle = 0;

  function animateAnimal() {
    // Simple tail wiggling animation
    let tailAngle = Math.sin(angle) * 15; // Wiggle angle

    g_bodyParts["frontTail"].rotateY(tailAngle);
    g_bodyParts["rearTail"].rotateY(-tailAngle);

    // Simple flipper animation (moving back and forth)
    let flipperAngle = Math.sin(angle * 2) * 10; // Flipper back-and-forth motion
    g_bodyParts["leftFlipper"].rotateX(flipperAngle);
    g_bodyParts["rightFlipper"].rotateX(-flipperAngle);

    // Increment the angle for the animation
    angle += 0.05; // Control speed of animation

    // Continue animation
    requestAnimationFrame(animateAnimal);
  }

  // Start the animation loop
  animateAnimal();
}



function updateAnimationAngles() {
  g_animal[1] = 65;
  g_animal[2] = -50;
  g_bodyParts["bodyFront"].setRotateY(45);
  g_bodyParts["bodyFront"].setRotateZ(-20);

 
}