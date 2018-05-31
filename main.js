function start() {

	var glLoop = function() {

		var gl = document.getElementById("glcanv").getContext("webgl");

		var prg = webglUtils.createProgramFromScripts(gl, [ "main-vs",
				"main-fs" ], undefined, undefined, function(msg) {
			alert(msg);
		});
		var prgCoordsLoc = gl.getAttribLocation(prg, "coords");
		var prgInColorLoc = gl.getUniformLocation(prg, "in_color");

		var vertices = [ -0.5, -0.5, 0, 0.5, 0.5, -0.5, 0, -0.2 ];
		var indices = [ 0, 1, 3, 2 ];

		var vertexbuff = gl.createBuffer();
		var indexbuff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexbuff);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexbuff);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);

		var color = 0.0;
		var delta = 0.0025;

		var drawScene = function(time) {

			color += delta;
			if (color < 0) {
				color = 0.0;
				delta *= -1;
			} else if (color > 1) {
				color = 1.0;
				delta *= -1;
			}

			gl.uniform1fv(prgInColorLoc,  [ color ]);

			gl.vertexAttribPointer(prgCoordsLoc, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(prgCoordsLoc);
			gl.useProgram(prg);

			gl.enable(gl.DEPHT_TEST);
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPHT_BUFFER_BIT);

			gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);

			requestAnimationFrame(drawScene);
		}

		requestAnimationFrame(drawScene);
	}

	var loadShaders = function(shaderElements, allLoaded) {

		var shaderElement = shaderElements.pop();
		if (shaderElement == undefined) {
			allLoaded();
			return;
		}

		var loader = new XMLHttpRequest();
		loader.onload = function() {
			shaderElement.removeAttribute("src");
			shaderElement.innerHTML = loader.responseText;
			loadShaders(shaderElements, allLoaded);
		}
		loader.onerror = loader.ontimeout = function() {
			loadShaders(shaderElements, allLoaded);
		}
		loader.open("GET", shaderElement.src + '?_=' + new Date().getTime());
		loader.send();
	}

	var shaderNodeList = document.querySelectorAll('*[src][type^="x-shader/"]');
	var shadersElements = [];
	var i;
	for (i = 0; i < shaderNodeList.length; i++) {
		shadersElements.push(shaderNodeList[i]);
	}
	loadShaders(shadersElements, glLoop);

}
