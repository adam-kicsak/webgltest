
function SkyboxShader(gl, projection) {
    
    BaseShader.call(this, gl, "vs:skybox", "fs:skybox");
    
    var program = this.program;
    gl.useProgram(program);

    this.positionLoc = gl.getAttribLocation(program, "position");
    this.projLoc = gl.getUniformLocation(program, "projection");
    this.transformLoc = gl.getUniformLocation(program, "transformation");
    this.cubeMapLoc = gl.getUniformLocation(program, "cubeMap");

    this.setProjection(projection);
    gl.useProgram(null);
}

SkyboxShader.prototype = Object.create(BaseShader.prototype)

SkyboxShader.prototype.constructor = SkyboxShader;

SkyboxShader.prototype.setTransformation = function(matrix) {
    var noTranslateMatrix = new Float32Array(matrix);
    noTranslateMatrix.set([0], 12);
    noTranslateMatrix.set([0], 13);
    noTranslateMatrix.set([0], 14);
    this.gl.uniformMatrix4fv(this.transformLoc, false, noTranslateMatrix);
};

SkyboxShader.prototype.setProjection = function(matrix) {
    this.gl.uniformMatrix4fv(this.projLoc, false, matrix);
}

SkyboxShader.prototype.setPositionBuffer = function(stride, offset) {
    if(stride !== undefined) {
        this.gl.vertexAttribPointer(this.positionLoc, 3, this.gl.FLOAT, false, stride, offset);
        this.gl.enableVertexAttribArray(this.positionLoc);
    } else {
        this.gl.disableVertexAttribArray(this.positionLoc);
    }
}

SkyboxShader.prototype.setTexture = function(texture) {
    texture.bind(this.gl.TEXTURE0);
    this.gl.uniform1i(this.cubeMapLoc, 0);
}



function Skybox(gl, projection, imageElementId) {
    
    this.gl = gl;
    this.skyboxShader = new SkyboxShader(gl, projection);
    
    var skyboxVertices = [
        -1,  1, -1,
        -1, -1, -1,
         1, -1, -1,
         1,  1, -1,
        -1, -1,  1,
        -1,  1,  1,
         1, -1,  1,
         1,  1,  1,
    ];

    var skyboxIndices = [
        0, 1, 2, 2, 3, 0,
        4, 1, 0, 0, 5, 4,
        2, 6, 7, 7, 3, 2,
        4, 5, 7, 7, 6, 4,
        0, 3, 7, 7, 5, 0,
        1, 4, 2, 2, 4, 6,
    ]
    
    this.skyboxVertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.skyboxVertexBuff );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxVertices), gl.STATIC_DRAW);
    
    this.skyboxIndexBuff = gl.createBuffer();
    this.skyboxIndexCount = skyboxIndices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skyboxIndexBuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(skyboxIndices), gl.STATIC_DRAW);
    
    this.cubeMapTexture = gl.createTextureCubemapFromImageElement(imageElementId);

}

Skybox.prototype.render = function(transformation) {
    
    var gl = this.gl;
    var shader = this.skyboxShader;
    
    gl.depthMask(false);
    shader.startProgram();
    shader.setTransformation(transformation);
    shader.setTexture(this.cubeMapTexture);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.skyboxVertexBuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skyboxIndexBuff);
    shader.setPositionBuffer(0, 0);
    
    gl.drawElements(gl.TRIANGLES, this.skyboxIndexCount, gl.UNSIGNED_SHORT, 0);
    
    shader.setPositionBuffer();
    shader.stopProgram();
    gl.depthMask(true);

}

Skybox.prototype.cleanup = function() {
    
    this.cubeMapTexture.cleanup();
    this.skyboxShader.cleanup();
}