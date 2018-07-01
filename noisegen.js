(function(root) {

  function cosInterpolate(v1, v2, p) {
    return v1 + (v2 - v1) * (0.5 - Math.cos(Math.PI * p) / 2);
  }
  
  function NoiseGenerator(amplitude, interpolate) {
    this.amplitude = amplitude || 1;
    this.amplitude2 = amplitude * 2;
    this.interpolate = interpolate || cosInterpolate;
    this.rawNoiseCache = {};
    this.smoothNoiseCache = {};
  }
  
  NoiseGenerator.prototype.constructor = NoiseGenerator;
  
  NoiseGenerator.prototype.rawNoise = function(x, z) {

    var rn = this.rawNoiseCache
    
    if (rn[x] === undefined) {
      rn[x] = {};
    }
    rnx = rn[x];
    
    if (rnx[z] === undefined) {
      var seed = Math.abs(x*59 + z*73) * 739;
      rnx[z] = new Random(seed).uniform() * this.amplitude2 - this.amplitude;
    }

    return rnx[z];
  }

  NoiseGenerator.prototype.smoothNoise = function(x, z) {

    var sn = this.smoothNoiseCache;
    
    if (sn[x] === undefined) {
      sn[x] = {};
    }
    snx = sn[x];
    
    if (snx[z] === undefined) {
      var diagonal = this.rawNoise(x-1, z-1) + this.rawNoise(x+1, z-1) 
        + this.rawNoise(x-1, z+1) + this.rawNoise(x+1, z+1);
      var cross = this.rawNoise(x, z+1) + this.rawNoise(x, z-1)
        + this.rawNoise(x+1, z) + this.rawNoise(x-1, z);
      var center = this.rawNoise(x, z);
      snx[z] = diagonal / 16 + cross / 8 + center / 4; 
    }

    return snx[z];
  }
  
  NoiseGenerator.prototype.interpolatedNoise = function(x, z) {
    
    var xa = Math.floor(x);
    var xb = xa + 1;
    var xp = x - xa;
    
    var za = Math.floor(z);
    var zb = za + 1;
    var zp = z - za;
    
    var y_xa_za = this.smoothNoise(xa, za);
    var y_xa_zb = this.smoothNoise(xa, zb);
    var y_xb_za = this.smoothNoise(xb, za);
    var y_xb_zb = this.smoothNoise(xb, zb);
    
    var y_x_za = this.interpolate(y_xa_za, y_xb_za, xp);
    var y_x_zb = this.interpolate(y_xa_zb, y_xb_zb, xp);
    var y_x_z = this.interpolate(y_x_za, y_x_zb, zp);
    
    return y_x_z;
  }

  root.NoiseGenerator = NoiseGenerator;
  

  
}(window));