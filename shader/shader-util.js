(function(root) {
    

    function BaseShader(gl, vScriptElementId, fScriptElementId) {

        console.log("creating proprams from script elements by ids '"
                + vScriptElementId + "' and '" + fScriptElementId + "'")

        var vScript = root.document.getElementById(vScriptElementId).text;
        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vScript);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(vs);
            throw 'Could not compile vertex shader. \n\n' + info;
        }
        delete vScript;

        var fScript = root.document.getElementById(fScriptElementId).text;
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fScript);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(fs);
            throw 'Could not compile fragment shader. \n\n' + info;
        }
        delete fScript;

        var sp = gl.createProgram();
        gl.attachShader(sp, vs);
        gl.attachShader(sp, fs);
        gl.linkProgram(sp);
        gl.validateProgram(sp);

        if (!gl.getProgramParameter(sp, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(sp);
            throw 'Could not link program. \n\n' + info;
        }

        this.gl = gl;
        this.program = sp;
        this.vShader = vs;
        this.fShader = fs;
        
    }

    BaseShader.prototype.cleanup = function() {
        if (!this.program) {
            return;
        }
        gl = this.gl;
        
        gl.useProgram(null);
        gl.detachShader(this.program, this.vShader);
        gl.detachShader(this.program, this.fShader);
        gl.deleteShader(this.vShader);
        gl.deleteShader(this.fShader);
        gl.deleteProgram(this.program);
        
        delete this.program;
        delete this.vShader;
        delete this.fShader;
    }

    BaseShader.prototype.startProgram = function() {
        if (this.program) {
            this.gl.useProgram(this.program);
        }
    }

    BaseShader.prototype.stopProgram = function() {
        if (this.program) {
            this.gl.useProgram(null);
        }
    }
    
    root.BaseShader = BaseShader;

    
    var fn = root.shaderUtil = root.shaderUtil || {};

    fn.loadDocumentShaderScriptBody = function(allLoaded) {

        var shaderNodeList = document
                .querySelectorAll('*[src][type^="x-shader/"]');
        var shadersElements = [];
        for (var i = 0; i < shaderNodeList.length; i++) {
            shadersElements.push(shaderNodeList[i]);
        }
        loadTopShaderOrNotify(shadersElements, allLoaded);
    }

    function loadTopShaderOrNotify(shaderScriptElements, allLoaded) {

        var shaderScriptElement = shaderScriptElements.pop();
        if (shaderScriptElement == undefined) {
            if (typeof allLoaded == "string") {
                allLoaded = root[allLoaded];
            }
            if (typeof allLoaded == "function") {
                allLoaded();
            }
            return;
        }

        var shaderUrl = scriptSourceUrl(shaderScriptElement)

        var loader = new XMLHttpRequest();
        loader.onload = function() {
            shaderScriptElement.removeAttribute("src");
            shaderScriptElement.innerHTML = loader.responseText;
            console.info("shader loaded: " + shaderUrl);
            loadTopShaderOrNotify(shaderScriptElements, allLoaded);
        }
        loader.onerror = loader.ontimeout = function() {
            console.error("shader load error: " + shaderUrl)
            loadTopShaderOrNotify(shaderScriptElements, allLoaded);
        }

        loader.open("get", shaderUrl);
        loader.send();
    }

    function scriptSourceUrl(shaderScriptElement) {
        var url = shaderScriptElement.src.split("?");
        url[0] += "?_=" + new Date().getTime();
        if (url.length > 1) {
            url[0] += "&" + url[1];
        }
        return url[0];
    }

    var cubemapCropping = function() {
        // Right, Left, Top, Bottom, Back, Front
        var cx = [ 2, 0, 1, 1, 1, 3 ];
        var cy = [ 1, 1, 0, 2, 1, 1 ];
        var cc = [];
        for (var i = 0; i < 6; i++) {
            cc.push({
                x : cx[i],
                y : cy[i]
            });
        }
        return cc;
    }();

    root.WebGLRenderingContext.prototype.createTexture2DFromImageElement = function(
            imageElementId) {

        var gl = this;

        console.log("creating 2d texture from image element by id '"
                + imageElementId + "'")

        var imageElement = root.document.getElementById(imageElementId);

        var img = new Uint8Array([ 255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255,
                255, 255, 255, 0, 255 ]);

        var tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                imageElement);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);

        return {
            bind : function(unit) {
                gl.activeTexture(unit);
                gl.bindTexture(gl.TEXTURE_2D, tex);
            },
            cleanup : function() {
                if (!tex) {
                    return;
                }
                gl.deleteTexture(tex);
                delete tex;
            }
        }
    }

    root.WebGLRenderingContext.prototype.createTextureCubemapFromImageElement = function(
            imageElementId) {

        var gl = this;

        console.log("creating cube map texture from image element by id '"
                + imageElementId + "'")

        var imageElement = root.document.getElementById(imageElementId);
        var imagew = imageElement.naturalWidth;
        var imageh = imageElement.naturalHeight;

        var canvasElement = root.document.createElement("canvas");
        canvasElement.setAttribute("width", imagew);
        canvasElement.setAttribute("height", imageh);
        var context2d = canvasElement.getContext("2d");
        context2d.drawImage(imageElement, 0, 0, imagew, imageh);

        var texw = Math.floor(imageElement.naturalWidth / 4);
        var texh = Math.floor(imageElement.naturalHeight / 3);
        var tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);

        for (var i = 0; i < cubemapCropping.length; i++) {
            var crop = cubemapCropping[i];
            var croppedImageDta = context2d.getImageData(texw * crop.x, texh
                    * crop.y, texw, texh);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB,
                    gl.RGB, gl.UNSIGNED_BYTE, croppedImageDta);
            delete croppedImageDta;
        }

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE);

        delete context2d;
        delete canvasElement;

        return {
            bind : function(unit) {
                gl.activeTexture(unit);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
            },
            cleanup : function() {
                if (!tex) {
                    return;
                }
                gl.deleteTexture(tex);
                delete tex;
            }
        }
    }

    root.WebGLRenderingContext.prototype.createTextureCubemapFromImageElements = function() {

        var gl = this;

        console.log("creating cube map texture from image elements by id "
                + JSON.stringify(arguments))

        var tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);

        for (var i = 0; i < 6; i++) {
            var imageElement = root.document.getElementById(arguments[i]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB,
                    gl.RGB, gl.UNSIGNED_BYTE, imageElement);
        }

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE);

        return {
            bind : function(unit) {
                gl.activeTexture(unit);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
            },
            cleanup : function() {
                if (!tex) {
                    return;
                }
                gl.deleteTexture(tex);
                delete tex;
            }
        }
    }

}(this));
