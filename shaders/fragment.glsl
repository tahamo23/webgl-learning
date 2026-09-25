precision mediump float;

varying vec4 vcolor;

uniform float x;

void main() {
 
    gl_FragColor = vec4(x * vcolor.r, (1.0 - x) * vcolor.g, x * vcolor.b, vcolor.a);

}