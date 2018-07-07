
var glCloseFlag = false;

function glClose() {
    glCloseFlag = true;
}

function glLoop() {

    function arrayOfArrays(size, init) {
      var a = new Array(size);
      for(var z = 0; z < size; z++) {
          a[z] = new Array(size);
          if(init) {
              for(var x = 0; x < size; x++) {
                  a[z][x] = 0;
              }
          }
      }
      return a;
    }
    
    var width = 800;
    var height = 480;
    
    var glCanvasElement = document.createElement("canvas")
    glCanvasElement.setAttribute("width", width);
    glCanvasElement.setAttribute("height", height);

    var bodyElement = document.getElementsByTagName("body")[0];
    bodyElement.insertBefore(glCanvasElement, bodyElement.childNodes[0]);
    
    
    var projection = new Float32Array(
        Matrices.perspective( 
            Math.PI / 180 * 45,
            width / height,
            0.1,
            1500
    ));


    var gl = glCanvasElement.getContext("webgl");
    gl.getExtension("OES_element_index_uint");
    
    var skybox = new Skybox(gl, projection, "tex:daylight");

    var terrainShader = new TerrainShader(gl, projection);
    var terrainGrassTexture = gl.createTexture2DFromImageElement("tex:terrain:grass");
    var terrainGroundTexture = gl.createTexture2DFromImageElement("tex:terrain:ground");
    
    function terrainOctave(size, octave, amplitudes, seedBaseX, seedBaseZ, heightMap) {
        
        if(heightMap == undefined) {
            heightMap = arrayOfArrays(size, true);
        }
        if(seedBaseX == undefined) {
            seedBaseX = 0;
        }
        if(seedBaseZ == undefined) {
            seedBaseZ = 0;
        }
        if(octave < 0) {
            return heightMap;
        }
        
        var amplitude = amplitudes[octave];
        if(amplitude == 0) {
            return terrainOctave(size, octave - 1, amplitudes, seedBaseX, seedBaseZ, heightMap);
        }

        var stride = Math.pow(2, octave);
        var count = size / stride;
        
        var bx = seedBaseX;
        var bz = seedBaseZ;
        
        var ng = new NoiseGenerator(amplitude);

        for(var x = 0; x < size; x++) {
            var xs = x / stride;
            for(var z = 0; z < size; z++) {
                var zs = z / stride;
                heightMap[x][z] += ng.interpolatedNoise(xs, zs);
            }
        }
        
        delete ng;
        
        return terrainOctave(size, octave - 1, amplitudes, seedBaseX, seedBaseZ, heightMap);
    }
    
    var terrainSize = 32;
    var terrainHeightMap = terrainOctave(terrainSize, 4, [1, 10, 20, 10, 5], 0, 0);
//    var terrainSize = 128;
//    var terrainHeightMap = terrainOctave(terrainSize, 6, [4, 1, 1, 30, 100, 20, 5], 0, 0);
    
    var grassRandom = new Random();
    
    var terrainIntensities = [];
    var terrainVertices = [];
    for(var x = 0, xp = -terrainSize; x < terrainSize; x++, xp+=2) {
        for(var z = 0, zp = -terrainSize; z < terrainSize; z++, zp+=2) {
            var yp = terrainHeightMap[x][z];
            
            terrainVertices.push(xp);
            terrainVertices.push(yp);
            terrainVertices.push(zp);

            var grass;
            if(yp > 30) {
              grass = 0;
            } else if(yp < 20) {
              grass = 1
            } else {
              grass = grassRandom.uniform();
            }
            var ground = 1 - grass; 
            
            terrainIntensities.push(grass);
            terrainIntensities.push(ground);
            terrainIntensities.push(0);
            terrainIntensities.push(0);
        }
    }
    
    var terrainIndices = [];
    for(var y = 1; y < terrainSize; y++) {
        var fx = y;
        var tx = terrainSize * terrainSize + y;
        for(var x = fx; x < tx; x += terrainSize) {
            terrainIndices.push(x - 1);
            terrainIndices.push(x);
        }
    }

    var terrainVertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, terrainVertexBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(terrainVertices), gl.STATIC_DRAW);

    var terrainIntensityBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, terrainIntensityBuff);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(terrainIntensities), gl.STATIC_DRAW);

    var terrainIndexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrainIndexBuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(terrainIndices), gl.STATIC_DRAW);
    


    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    function glClose() {
        skybox.cleanup();
        terrainShader.cleanup();
        terrainGrassTexture.cleanup();
        terrainGroundTexture.cleanup();
        
        gl.getExtension('WEBGL_lose_context').loseContext();
        bodyElement.removeChild(glCanvasElement);
    }
    
     function computeTransformation( now ) {

        var translate = Matrices.translate(0, 0, -30);
        var scale = Matrices.scale(0.25, 0.25, 0.25);
        var rotateX = Matrices.rotateX(- Math.sin(now * 0.0001) * Math.PI/8 - Math.PI/8 );
        var rotateY = Matrices.rotateY( now * 0.0003 );
        
        return new Float32Array(Matrices.multiplyList([
          translate,
          rotateX, 
          rotateY, 
          scale
        ]));
     }

    function drawScene(now) {

       
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPHT_BUFFER_BIT);
        
        // var transformation = computeTransformation(now);
        
        var camera = new Camera();
        camera.setTarget([0, 0, 0]);
        camera.setPosition([0, 0, -100]);
        var transformation = camera.getTransformation();

        terrainShader.startProgram();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, terrainVertexBuff);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrainIndexBuff);
        terrainShader.setCoordsBuffer(0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, terrainIntensityBuff);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrainIndexBuff);
        terrainShader.setIntensitiesBuffer(0, 0);
        
        terrainShader.setTransformation(transformation);
        
        terrainShader.setTextures([terrainGrassTexture, terrainGroundTexture]);
        
        var indicesPerDraw = terrainSize * 2;
        var offs = 0;
        for(var offs = 0; offs < terrainIndices.length; offs += indicesPerDraw) {
            gl.drawElements(gl.TRIANGLE_STRIP, indicesPerDraw, gl.UNSIGNED_INT, offs * 4);
        }

        terrainShader.setCoordsBuffer();
        terrainShader.setIntensitiesBuffer();
        terrainShader.stopProgram();

        skybox.render(transformation);
        
        if(glCloseFlag) {
            glClose();
        } else {
            requestAnimationFrame(drawScene);
        }

    }

    requestAnimationFrame(drawScene);

}
