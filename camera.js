(function(root){
  
  function Camera() {
    this.position = [0, 1, 1, 1];
    this.target = [0, 0, 0, 1];
    this.up = [0, 1, 0, 1];
  }
  
  Camera.prototype.constructor = Camera;
  
  Camera.prototype.getTransformation = function(scale) {
    
    var mFront = Vectors.normalize(Vectors.sub(this.position, this.target));
    var mRight = Vectors.normalize(Vectors.cross(this.up, mFront));
    var mUp = Vectors.normalize(Vectors.cross(mFront, mRight));
    
    var mRotation = [
      mRight[0], mRight[1], mRight[2], 0,
      mUp[0],    mUp[1],    mUp[2],    0,
      mFront[0], mFront[1], mFront[2], 0,
      0,         0,         0,         1
    ];
    
    var mTranslation = [
      1,                 0,                 0,                 0,
      0,                 1,                 0,                 0,
      0,                 0,                 1,                 0,
      -this.position[0], -this.position[1], -this.position[2], 1 
    ];
    
    return Matrices.multiply(mRotation, mTranslation);
  }
  
  Camera.prototype.setPosition = function(p) {
    this.position = p;
    this.position[3] = 1;
  }
  
  Camera.prototype.setTarget = function(t) {
    this.target = t;
    this.target[3] = 1;
  }
  
  Camera.prototype.setUp = function(u) {
    this.up = u;
    this.up[3] = 1;
  }
  
  root.Camera = Camera;
  
}(window));