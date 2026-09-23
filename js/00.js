async function loadShaderSource(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Failed to load shader: ${path}`);
    }

    return await response.text();
}


window.onload = async function () {

    const canvas = document.getElementById("mycanvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1, 1, 1, 0);
    gl.lineWidth(1.0);

    var positions = [
        -0.5, +0.5, +0.0,
        +0.5, +0.5, +0.0,
        +0.0, -0.5, +0.0,
        +0.5, +0.5, +0.0,
    ]

    var colors = [
        1, 0, 0.5, 1,
        0, 1, 1, 1,
        1, 0.5, 0.5, 1,
        1, 0.5, 0.5, 1,
    ]


    var position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var vs_source = await loadShaderSource("shaders/vertex.glsl");
    var fs_source = await loadShaderSource("shaders/fragment.glsl");


    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vs_source);
    gl.compileShader(vs);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vs));
        gl.deleteShader(vs);
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fs_source);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fs));
        gl.deleteShader(fs);
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        alert(gl.getProgramInfoLog(prog));
    }

    var uniform = gl.getUniformLocation(prog, "trans");
    var trans = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    gl.useProgram(prog);
    gl.uniformMatrix4fv(uniform, false, trans);

    var positionAttribute = gl.getAttribLocation(prog, "pos");
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribute);

    var colorAttribute = gl.getAttribLocation(prog, "clr");
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(colorAttribute, 4, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(colorAttribute);



    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

};
