var Vectors = Vectors || {};

Vectors.add = function(a, b) {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
    1
  ];
}

Vectors.sub = function(a, b) {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
    1
  ];
}

Vectors.length = function(v) {
  return Math.sqrt(Vectors.dot(v, v));
}

Vectors.normalize = function(v) {
  var n = 1 / Vectors.length(v);
  return [
    v[0] * n,
    v[1] * n,
    v[2] * n,
    1
  ];
}

Vectors.cross = function(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
    1
  ];
}

Vectors.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

