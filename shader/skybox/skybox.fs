
precision mediump float;

varying vec3 textureCoords;

uniform samplerCube cubeMap;

void main() {

  gl_FragColor = textureCube(cubeMap,  textureCoords);
}