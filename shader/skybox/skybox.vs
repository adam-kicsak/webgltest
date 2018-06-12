
attribute vec3 position;

uniform mat4 projection;
uniform mat4 transformation;

varying vec3 textureCoords;

void main() {
  gl_Position = projection * transformation * vec4(position * 1000.0, 1.0);
  textureCoords = position;
}