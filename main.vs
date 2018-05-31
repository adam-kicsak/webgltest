
attribute vec2 coords;

varying vec4 vertex_pos;

void main(void){

  vertex_pos = vec4(coords, 0.0, 1.0);
	gl_Position = vertex_pos;

}
