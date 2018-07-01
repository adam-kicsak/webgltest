function TerrainShader(gl, projection) {

  BaseShader.call(this, gl, "vs:terrain", "fs:terrain");

  var program = this.program;
  gl.useProgram(program);

  this.projLoc = gl.getUniformLocation(program, "projection");
  this.transformLoc = gl.getUniformLocation(program, "transformation");
  this.coordsLoc = gl.getAttribLocation(program, "coords");
  this.intensitiesLoc = gl.getAttribLocation(program, "intensities");
  this.texturesLoc = gl.getUniformLocation(program, "textures");

  this.setProjection(projection);

  gl.useProgram(null);

}

TerrainShader.prototype = Object.create(BaseShader.prototype);

TerrainShader.prototype.constructor = TerrainShader;

TerrainShader.prototype.setTransformation = function(matrix) {
  this.gl.uniformMatrix4fv(this.transformLoc, false, matrix);
};

TerrainShader.prototype.setProjection = function(matrix) {
  this.gl.uniformMatrix4fv(this.projLoc, false, matrix);
}

TerrainShader.prototype.setCoordsBuffer = function(stride, offset) {
  if (stride !== undefined) {
    this.gl.vertexAttribPointer(this.coordsLoc, 3, this.gl.FLOAT, false, stride, offset);
    this.gl.enableVertexAttribArray(this.coordsLoc);
  } else {
    this.gl.disableVertexAttribArray(this.coordsLoc);
  }
};

TerrainShader.prototype.setIntensitiesBuffer = function(stride, offset) {
  if (stride !== undefined) {
    this.gl.vertexAttribPointer(this.intensitiesLoc, 4, this.gl.FLOAT, false, stride, offset);
    this.gl.enableVertexAttribArray(this.intensitiesLoc);
  } else {
    this.gl.disableVertexAttribArray(this.intensitiesLoc);
  }
};

TerrainShader.prototype.setTextures = function(textures) {
  for (var i = 0; i < textures.length; i++) {
    textures[i].bind(this.gl.TEXTURE0 + i);
  }
  this.gl.uniform1iv(this.texturesLoc, [ 0, 1, 2, 3 ]);
}
