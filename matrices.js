var Matrices = Matrices || {};

Matrices.multiply = function (a, b) {
  var result = new Array();
  for (row = 0; row < 4; row++) {
    for (col = 0; col < 4; col++) {
      var total = 0;
      for (var ai = col, bi = row * 4; ai < 16; ai += 4, bi++) {
        total += a[ai] * b[bi];
      }
      result.push(total);
    }
  }
  return result;
}

Matrices.multiplyList = function (matrices) {
  var result = matrices[0];
  for(var i=1; i < matrices.length; i++) {
    result = Matrices.multiply(result, matrices[i]);
  }
  return result;
}

Matrices.rotateX = function (a) {
  return [
    1,  0,            0,             0,
    0,  Math.cos(a),  -Math.sin(a),  0,
    0,  Math.sin(a),  Math.cos(a),   0,
    0,  0,            0,             1
  ];
}

Matrices.rotateY = function (a) {
  return [
    Math.cos(a),   0,  Math.sin(a),  0,
    0,             1,  0,            0,
    -Math.sin(a),  0,  Math.cos(a),  0,
    0,             0,  0,            1
  ];
}

Matrices.rotateZ = function (a) {
  return [
    Math.cos(a),  -Math.sin(a),  0,  0,
    Math.sin(a),  Math.cos(a),   0,  0,
    0,            0,             1,  0,
    0,            0,             0,  1
  ];
}

Matrices.translate = function (x, y, z) {
  return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      x,  y,  z,  1
  ];
}

Matrices.scale = function (w, h, d) {
  return [
      w,  0,  0,  0,
      0,  h,  0,  0,
      0,  0,  d,  0,
      0,  0,  0,  1
  ];
}

Matrices.perspective = function (fov, aspect, near, far) {
  
  var f = 1.0 / Math.tan(fov / 2);
  var rangeInv = 1 / (near - far);
 
  return [
    f / aspect,  0,  0,                          0,
    0,           f,  0,                          0,
    0,           0,  (near + far) * rangeInv,    -1,
    0,           0,  near * far * rangeInv * 2,  0
  ];
}

Matrices.ortho = function(left, right, bottom, top, near, far) {

  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  
  var tx = (left + right) * lr;
  var ty = (top + bottom) * bt;
  var tz = (far + near) * nf;
  
  lr *= -2;
  bt *= -2;
  nf *= -2;
  
  return [
    lr,  0,   0,   0,
    0,   bt,  0,   0,
    0,   0,   nf,  0,
    tx,  ty,  tz,  1
  ];
}

