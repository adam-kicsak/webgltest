precision mediump float;

varying vec4 ti;
varying vec2 tp;

uniform sampler2D textures[4]; 

void main(void){

  vec4 color = vec4(0.0);
  
  for(int i = 0; i < 4; i++) {
    float intensity = ti[i]; 
    if(intensity > 0.0) {
      color += intensity * texture2D(textures[i], 0.125 * tp );
    }
  }
  
  color.a = 1.0;

  gl_FragColor = color;
}