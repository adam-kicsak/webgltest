
precision highp float;

uniform float in_color;
varying vec4 vertex_pos;

void main(void){


  vec3 vp = vertex_pos.xyz;
  
	gl_FragColor = vec4(vp * in_color, 1.0);
}
