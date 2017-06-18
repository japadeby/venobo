import WebChimera from 'webchimera.js'
import {remote, screen} from 'electron'

class Texture {

  constructor(gl) {
    this.gl = gl
    this.texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    gl.textParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.textParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.textParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.textParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  bind(n, program, name) {
    const {gl} = this

    gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2][n])
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.uniform1i(gl.getUniformLocation(program, name), n)
  }

  fill(width, height, data) {
    const {gl} = this

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data)
  }

}

export default class wcjsRenderer {

  canvas: Object

  static init(canvas, params, options) {
    const vlc = wcjs.createPlayer(params)

    var dropLoop, newFrame

    if (typeof canvas === 'string') {
      canvas = window.document.querySelector(canvas)
    }

    this.canvas = canvas

    this.setupCanvas(canvas, vlc, options)

    vlc.onFrameSetup = (width, height, pixelFormat) => {
      this.frameSetup(canvas, width, height, pixelFormat)

      const {gl} = canvas

      const loopB = () => {
        if (newFrame && gl) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        newFrame = false
        drawB()
      }

      const loopA = () => {
        if (newFrame && gl) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        newFrame = false
        drawA()
      }

      const drawA = () => drawLoop = window.requestAnimation(loopB)

      const drawB = () => drawLoop = window.requestAnimation(loopA)

      drawA()

      canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault()
        console.log('webgl context lost')
      }, false)

      canvas.addEventListener("webglcontextrestored", (w, h, p) => {
        return (e) => {
          this.setupCanvas(canvas, vlc, options)
          this.frameSetup(canvas, w, h, p)
          console.log('webgl context restored')
        }
      }(width, height, pixelFormat), false)
    }

    vlc.onFrameReady = (videoFrame) => {
      (canvas.gl ? render : renderFallback)(canvas, videoFrame)
      newFrame = true
    }

    vlc.onFrameCleanup = () => {
      if (drawLoop) {
        window.cancelAnimation(drawLoop)
        drawLoop = null
      }
    }

    return vlc
  }

  /*reinit(canvas, vlc, options) {
    if (typeof canvas === 'string') {
      canvas = window.document.querySelector(canvas)
    }

    this._canvas = canvas

    this.setupCanvas(canvas, vlc, options)

    vlc.onFrameSetup =
            function(width, height, pixelFormat) {
                frameSetup(canvas, width, height, pixelFormat);

                var loopB = function() {
                    var gl = canvas.gl;
                    if (newFrame && gl) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                    newFrame = false;
                    drawB();
                };

                var loopA = function() {
                    var gl = canvas.gl;
                    if (newFrame && gl) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                    newFrame = false;
                    drawA();
                };

                var drawA = function() {
                    drawLoop = window.requestAnimationFrame(loopB);
                };
                var drawB = function() {
                    drawLoop = window.requestAnimationFrame(loopA);
                };
                drawA();

                canvas.addEventListener("webglcontextlost",
                    function(event) {
                        event.preventDefault();
                        console.log("webgl context lost");
                    }, false);

                canvas.addEventListener("webglcontextrestored",
                    function(w, h, p) {
                        return function(event) {
                            setupCanvas(canvas, vlc, options);
                            frameSetup(canvas, w, h, p);
                            console.log("webgl context restored");
                        }
                    }(width, height, pixelFormat), false);

        };

        vlc.onFrameReady =
            function(videoFrame) {
                (canvas.gl ? render : renderFallback)(canvas, videoFrame);
                newFrame = true;
        };
        vlc.onFrameCleanup =
            function() {
                if (drawLoop) {
                    window.cancelAnimationFrame(drawLoop);
                    drawLoop = null;
                }
        };
    return vlc;
  }*/

  static setupCanvas(canvas, vlc, options) {
    if (!options.fallbackRenderer) {
      canvas.gl = canvas.getContext('webgl', {
        preserveDrawingBuffer: Boolean(options.preserveDrawingBuffer)
      })
    }

    if (!canvas.gl || options.fallbackRenderer) {
      console.log(options.fallbackRenderer ? "Fallback renderer forced, not using WebGL" : "Unable to initialize WebGL, falling back to canvas rendering");
      vlc.pixelFormat = vlc.RV32
      canvas.ctx = canvas.getContext('2d')
      delete canvas.gl
      return
    }

    vlc.pixelFormat = vlc.I420
    const program = canvas.I420Program = gl.createProgram()
    const vertexShaderSource = [
      "attribute highp vec4 aVertexPosition;",
      "attribute vec2 aTextureCoord;",
      "varying highp vec2 vTextureCoord;",
      "void main(void) {",
      " gl_Position = aVertexPosition;",
      " vTextureCoord = aTextureCoord;",
      "}"
    ].join("\n")

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)

    const fragmentShaderSource = [
        "precision highp float;",
        "varying lowp vec2 vTextureCoord;",
        "uniform sampler2D YTexture;",
        "uniform sampler2D UTexture;",
        "uniform sampler2D VTexture;",
        "const mat4 YUV2RGB = mat4",
        "(",
        " 1.1643828125, 0, 1.59602734375, -.87078515625,",
        " 1.1643828125, -.39176171875, -.81296875, .52959375,",
        " 1.1643828125, 2.017234375, 0, -1.081390625,",
        " 0, 0, 0, 1",
        ");",
        "void main(void) {",
        " gl_FragColor = vec4( texture2D(YTexture, vTextureCoord).x, texture2D(UTexture, vTextureCoord).x, texture2D(VTexture, vTextureCoord).x, 1) * YUV2RGB;",
        "}"
    ].join("\n")

    const fragmentShader = gl.createShader(gl.FRAMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader)
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log('Shader link failed')
    }

    const vertexPositionAttribute = gl.getAttributeLocation(program, "aVertexPosition")
    gl.enableVertexAttribArray(vertexPositionAttribute)

    const textureCoordAttribute = gl.getAttributeLocation(program, "aTextureCoord")
    gl.enableVertexAttribArray(textureCoordAttribute)

    const verticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]),
      gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
      gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

    const textureGl = new Texture(gl)
    gl.y = textureGl
    gl.y.bind(0, program, "YTexture")
    gl.u = textureGl
    gl.u.bind(1, program, "UTexture")
    gl.v = textureGl
    gl.v.bind(2, program, "VTexture")
  }

  /*resizeInBounds(newWidth, newHeight) {
    const win = remote.getCurrentWindow()
    const bounds = win.getBounds()

    const scr = screen.getDisplayNearestPoint({x: bounds.x, y: bounds.y})

    if (scr) {
      if (newWidth >= scr.workArea.width) {
        if (newHeight >= scr.workArea.height) {

        }
      }
    }
  }*/

  static render(canvas, videoFrame) {
    const {gl} = this.canvas

    const {width, height, uOffset, vOffset, length} = videoFrame

    gl.y.fill(width, height, videoFrame.subarray(0, uOffset))
    gl.u.fill(width >> 1, height >> 1, videoFrame.subarray(uOffset, vOffset))
    gl.v.fill(width >> 1, height >> 1, videoFrame.subarray(vOffset, length))
  }

  static renderFallback(canvas, videoFrame) {
    const buf = canvas.img.data
    const {width, height} = videoFrame

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let o = (j + (width * i)) * 4
        buf[o + 0] = videoFrame[0 + 2]
        buf[o + 1] = videoFrame[o + 1]
        buf[o + 2] = videoFrame[o + 0]
        buf[o + 3] = videoFrame[o + 3]
      }
    }
    canvas.ctx.putImageData(canvas.img, 0, 0)
  }

  static clearCanvas() {
    const {gl} = this.canvas
    var arr1 = new Uint8Array(1)
    var arr2 = new Uint8Array(1)

    arr1[0] = 0
    arr2[0] = 128

    if (!gl) return

    gl.y.fill(1, 1, arr1)
    gl.u.fill(1, 1, arr2)
    gl.v.fill(1, 1, arr2)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    this._canvas = false
  }

}
