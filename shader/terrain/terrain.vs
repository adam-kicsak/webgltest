
attribute vec3 coords;
attribute vec4 intensities; 

uniform mat4 projection;
uniform mat4 transformation;

varying vec4 ti;
varying vec2 tp;

void main(void){

  ti = intensities;
  tp = coords.xz;
  gl_Position = projection * transformation *  vec4(coords, 1.0);

}
