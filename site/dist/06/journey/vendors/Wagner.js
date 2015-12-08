(function(){"use strict";var s=s||{};s.vertexShadersPath="./glsl/postprocess",s.fragmentShadersPath="./glsl/postprocess",s.assetsPath="./assets",s.basicVs="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }";var t="varying vec2 vUv; uniform sampler2D tInput; void main() {gl_FragColor = texture2D( tInput, vUv );}";s.log=function(){},s.Composer=function(t,a){this.width=1,this.height=1,this.settings=a||{},this.useRGBA=this.settings.useRGBA||!1,this.renderer=t,this.copyPass=new s.CopyPass(this.settings),this.scene=new THREE.Scene,this.quad=new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1),this.defaultMaterial),this.scene.add(this.quad),this.camera=new THREE.OrthographicCamera(1,1,1,1,-1e4,1e4),this.front=new THREE.WebGLRenderTarget(1,1,{minFilter:void 0!==this.settings.minFilter?this.settings.minFilter:THREE.LinearFilter,magFilter:void 0!==this.settings.magFilter?this.settings.magFilter:THREE.LinearFilter,wrapS:void 0!==this.settings.wrapS?this.settings.wrapS:THREE.ClampToEdgeWrapping,wrapT:void 0!==this.settings.wrapT?this.settings.wrapT:THREE.ClampToEdgeWrapping,format:this.useRGBA?THREE.RGBAFormat:THREE.RGBFormat,type:void 0!==this.settings.type?this.settings.type:THREE.UnsignedByteType,stencilBuffer:void 0!==this.settings.stencilBuffer?this.settings.stencilBuffer:!0}),this.back=this.front.clone(),this.startTime=Date.now(),this.passes={}},s.Composer.prototype.linkPass=function(s,t){function a(t){this.message='Pass "'+s+'" already loaded.',this.name="WagnerLoadPassException",this.toString=function(){return this.message}}if(this.passes[s])throw new a(s,t);this.passes[s]=t},s.Composer.prototype.swapBuffers=function(){this.output=this.write,this.input=this.read;var s=this.write;this.write=this.read,this.read=s},s.Composer.prototype.render=function(s,t,a,e){this.copyPass.isLoaded()&&(a&&this.swapBuffers(),this.renderer.render(s,t,e?e:this.write,!0),e||this.swapBuffers())},s.Composer.prototype.toScreen=function(){this.copyPass.isLoaded()&&(this.quad.material=this.copyPass.shader,this.quad.material.uniforms.tInput.value=this.read,this.quad.material.uniforms.resolution.value.set(this.width,this.height),this.renderer.render(this.scene,this.camera))},s.Composer.prototype.toTexture=function(s){this.copyPass.isLoaded()&&(this.quad.material=this.copyPass.shader,this.quad.material.uniforms.tInput.value=this.read,this.renderer.render(this.scene,this.camera,s,!0))},s.Composer.prototype.pass=function(t){if("string"==typeof t&&(this.quad.material=this.passes[t]),t instanceof THREE.ShaderMaterial&&(this.quad.material=t),t instanceof s.Pass){if(!t.isLoaded())return;return void t.run(this)}t.isSim||(this.quad.material.uniforms.tInput.value=this.read),this.quad.material.uniforms.resolution.value.set(this.width,this.height),this.quad.material.uniforms.time.value=.001*(Date.now()-this.startTime),this.renderer.render(this.scene,this.camera,this.write,!1),this.swapBuffers()},s.Composer.prototype.reset=function(){this.read=this.front,this.write=this.back,this.output=this.write,this.input=this.read},s.Composer.prototype.setSource=function(s){this.copyPass.isLoaded()&&(this.quad.material=this.copyPass.shader,this.quad.material.uniforms.tInput.value=s,this.renderer.render(this.scene,this.camera,this.write,!0),this.swapBuffers())},s.Composer.prototype.setSize=function(t,a){this.width=t,this.height=a,this.camera.projectionMatrix.makeOrthographic(t/-2,t/2,a/2,a/-2,this.camera.near,this.camera.far),this.quad.scale.set(t,a,1);var e=this.front.clone();e.width=t,e.height=a,this.quad.material instanceof s.Pass&&(this.quad.material.uniforms.tInput.value=e),this.front=e,e=this.back.clone(),e.width=t,e.height=a,this.back=e},s.Composer.prototype.defaultMaterial=new THREE.MeshBasicMaterial,s.loadShader=function(s,t){var a=new XMLHttpRequest;a.onload=function(){var s=a.responseText;t(s)}.bind(this),a.onerror=function(){function t(s){this.message='Shader "'+s+"\" couldn't be loaded.",this.name="WagnerLoadShaderException",this.toString=function(){return this.message}}throw new t(s)},a.onabort=function(){function t(s){this.message='Shader "'+s+'" load was aborted.',this.name="WagnerLoadShaderException",this.toString=function(){return this.message}}throw new t(s)},a.open("get",s,!0),a.send()},s.processShader=function(t,a){s.log("Processing Shader | Performing uniform Reflection...");for(var e,r,o,i,n=/uniform\s+([^\s]+)\s+([^\s]+)\s*;/gi,h=/uniform\s+([^\s]+)\s+([^\s]+)\s*\[\s*(\w+)\s*\]*\s*;/gi,l={sampler2D:{type:"t",value:function(){return new THREE.Texture}},samplerCube:{type:"t",value:function(){}},bool:{type:"b",value:function(){return 0}},"int":{type:"i",value:function(){return 0}},"float":{type:"f",value:function(){return 0}},vec2:{type:"v2",value:function(){return new THREE.Vector2}},vec3:{type:"v3",value:function(){return new THREE.Vector3}},vec4:{type:"v4",value:function(){return new THREE.Vector4}},bvec2:{type:"v2",value:function(){return new THREE.Vector2}},bvec3:{type:"v3",value:function(){return new THREE.Vector3}},bvec4:{type:"v4",value:function(){return new THREE.Vector4}},ivec2:{type:"v2",value:function(){return new THREE.Vector2}},ivec3:{type:"v3",value:function(){return new THREE.Vector3}},ivec4:{type:"v4",value:function(){return new THREE.Vector4}},mat2:{type:"v2",value:function(){return new THREE.Matrix2}},mat3:{type:"v3",value:function(){return new THREE.Matrix3}},mat4:{type:"v4",value:function(){return new THREE.Matrix4}}},p={"float":{type:"fv",value:function(){return[]}},vec3:{type:"v3v",value:function(){return[]}}},u={resolution:{type:"v2",value:new THREE.Vector2(1,1),"default":!0},time:{type:"f",value:Date.now(),"default":!0},tInput:{type:"t",value:new THREE.Texture,"default":!0}};null!==(e=n.exec(a));)e.index===n.lastIndex&&n.lastIndex++,r=e[1],o=e[2],s.log("  > SINGLE",r,o),u[o]={type:l[r].type,value:l[r].value()};for(;null!==(e=h.exec(a));)e.index===n.lastIndex&&n.lastIndex++,r=e[1],o=e[2],i=e[3],s.log("  > ARRAY",i,r,o),u[o]={type:p[r].type,value:p[r].value()};s.log("Uniform reflection completed. Compiling...");var c=new THREE.ShaderMaterial({uniforms:u,vertexShader:t,fragmentShader:a,shading:THREE.FlatShading,depthWrite:!1,depthTest:!1,transparent:!0});return s.log("Compiled"),c},s.Pass=function(){s.log("Pass constructor"),this.shader=null,this.loaded=null,this.params={},this.isSim=!1},s.Pass.prototype.loadShader=function(t,a){var e=this,r=s.basicVs;s.loadShader(s.fragmentShadersPath+"/"+t,function(t){e.shader=s.processShader(r,t),a&&a.apply(e)})},s.Pass.prototype.mapUniforms=function(s){var t=this.params;for(var a in s)s[a]["default"]||!function(a){Object.defineProperty(t,a,{get:function(){return s[a].value},set:function(t){s[a].value=t},configurable:!1})}(a)},s.Pass.prototype.run=function(s){s.pass(this.shader)},s.Pass.prototype.isLoaded=function(){return null!==this.loaded?this.loaded:void(this.shader instanceof THREE.ShaderMaterial&&(this.loaded=!0))},s.Pass.prototype.getOfflineTexture=function(s,t,a){var e=new THREE.WebGLRenderTarget(s,t,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:a?THREE.RGBAFormat:THREE.RGBFormat});return e},s.CopyPass=function(){s.Pass.call(this),s.log("CopyPass constructor");var a=t,e=s.basicVs;this.shader=s.processShader(e,a)},s.CopyPass.prototype=Object.create(s.Pass.prototype),s.GenericPass=function(t,a){s.Pass.call(this);var e=this;s.loadShader(s.vertexShadersPath+"/orto-vs.glsl",function(r){s.loadShader(t,function(t){e.shader=s.processShader(r,t),a&&a.apply(e)})})},s.GenericPass.prototype=Object.create(s.Pass.prototype),s.BlendPass=function(){s.Pass.call(this),s.log("BlendPass constructor"),this.loadShader("blend-fs.glsl"),this.params.mode=1,this.params.opacity=1,this.params.tInput2=null,this.params.resolution2=new THREE.Vector2,this.params.sizeMode=1,this.params.aspectRatio=1,this.params.aspectRatio2=1},s.BlendMode={Normal:1,Dissolve:2,Darken:3,Multiply:4,ColorBurn:5,LinearBurn:6,DarkerColor:7,Lighten:8,Screen:9,ColorDodge:10,LinearDodge:11,LighterColor:12,Overlay:13,SoftLight:14,HardLight:15,VividLight:16,LinearLight:17,PinLight:18,HardMix:19,Difference:20,Exclusion:21,Substract:22,Divide:23},s.BlendPass.prototype=Object.create(s.Pass.prototype),s.BlendPass.prototype.run=function(s){this.shader.uniforms.mode.value=this.params.mode,this.shader.uniforms.opacity.value=this.params.opacity,this.shader.uniforms.tInput2.value=this.params.tInput2,this.shader.uniforms.sizeMode.value=this.params.sizeMode,this.shader.uniforms.aspectRatio.value=this.params.aspectRatio,this.shader.uniforms.aspectRatio2.value=this.params.aspectRatio2,s.pass(this.shader)},s.InvertPass=function(){s.Pass.call(this),s.log("InvertPass constructor"),this.loadShader("invert-fs.glsl")},s.InvertPass.prototype=Object.create(s.Pass.prototype),s.SepiaPass=function(){s.Pass.call(this),s.log("SepiaPass constructor"),this.loadShader("sepia-fs.glsl"),this.params.amount=1},s.SepiaPass.prototype=Object.create(s.Pass.prototype),s.SepiaPass.prototype.run=function(s){this.shader.uniforms.amount.value=this.params.amount,s.pass(this.shader)},s.BrightnessContrastPass=function(){s.Pass.call(this),s.log("BrightnessContrastPass constructor"),this.loadShader("brightness-contrast-fs.glsl"),this.params.brightness=1,this.params.contrast=1},s.BrightnessContrastPass.prototype=Object.create(s.Pass.prototype),s.BrightnessContrastPass.prototype.run=function(s){this.shader.uniforms.brightness.value=this.params.brightness,this.shader.uniforms.contrast.value=this.params.contrast,s.pass(this.shader)},s.Pass.prototype.bindUniform=function(s,t,a,e){Object.defineProperty(s,a,{get:function(){return t.uniforms[id].value},set:e,configurable:!1})},s.NoisePass=function(){s.Pass.call(this),s.log("Noise Pass constructor"),this.loadShader("noise-fs.glsl"),this.params.amount=.1,this.params.speed=0},s.NoisePass.prototype=Object.create(s.Pass.prototype),s.NoisePass.prototype.run=function(s){this.shader.uniforms.amount.value=this.params.amount,this.shader.uniforms.speed.value=this.params.speed,s.pass(this.shader)},s.VignettePass=function(){s.Pass.call(this),s.log("Vignette Pass constructor"),this.loadShader("vignette-fs.glsl"),this.params.amount=1,this.params.falloff=.1},s.VignettePass.prototype=Object.create(s.Pass.prototype),s.VignettePass.prototype.run=function(s){this.shader.uniforms.amount.value=this.params.amount,this.shader.uniforms.falloff.value=this.params.falloff,s.pass(this.shader)},s.Vignette2Pass=function(){s.Pass.call(this),s.log("Vignette Pass constructor"),this.loadShader("vignette2-fs.glsl"),this.params.boost=2,this.params.reduction=2},s.Vignette2Pass.prototype=Object.create(s.Pass.prototype),s.Vignette2Pass.prototype.run=function(s){this.shader.uniforms.boost.value=this.params.boost,this.shader.uniforms.reduction.value=this.params.reduction,s.pass(this.shader)},s.DenoisePass=function(){s.Pass.call(this),s.log("Denoise Pass constructor"),this.loadShader("denoise-fs.glsl"),this.params.exponent=5,this.params.strength=10},s.DenoisePass.prototype=Object.create(s.Pass.prototype),s.DenoisePass.prototype.run=function(s){this.shader.uniforms.exponent.value=this.params.exponent,this.shader.uniforms.strength.value=this.params.strength,s.pass(this.shader)},s.BoxBlurPass=function(){s.Pass.call(this),s.log("BoxBlurPass Pass constructor"),this.loadShader("box-blur2-fs.glsl"),this.params.delta=new THREE.Vector2(0,0),this.params.taps=1},s.BoxBlurPass.prototype=Object.create(s.Pass.prototype),s.BoxBlurPass.prototype.run=function(s){this.shader.uniforms.delta.value.copy(this.params.delta),s.pass(this.shader)},s.FullBoxBlurPass=function(){s.Pass.call(this),s.log("FullBoxBlurPass Pass constructor"),this.boxPass=new s.BoxBlurPass,this.params.amount=20,this.params.taps=1},s.FullBoxBlurPass.prototype=Object.create(s.Pass.prototype),s.FullBoxBlurPass.prototype.isLoaded=function(){return this.boxPass.isLoaded()&&(this.loaded=!0),s.Pass.prototype.isLoaded.call(this)},s.FullBoxBlurPass.prototype.run=function(s){var t=this.params.amount;this.boxPass.params.delta.set(t,0),this.boxPass.params.taps=this.params.taps,s.pass(this.boxPass),this.boxPass.params.delta.set(0,t),s.pass(this.boxPass)},s.ZoomBlurPass=function(){s.Pass.call(this),s.log("ZoomBlurPass Pass constructor"),this.loadShader("zoom-blur-fs.glsl"),this.params.center=new THREE.Vector2(.5,.5),this.params.strength=2},s.ZoomBlurPass.prototype=Object.create(s.Pass.prototype),s.ZoomBlurPass.prototype.run=function(s){this.shader.uniforms.center.value.copy(this.params.center),this.shader.uniforms.strength.value=this.params.strength,s.pass(this.shader)},s.MultiPassBloomPass=function(t,a){s.Pass.call(this),s.log("MultiPassBloomPass Pass constructor"),this.composer=null,this.tmpTexture=this.getOfflineTexture(t,a,!0),this.blurPass=new s.FullBoxBlurPass,this.blendPass=new s.BlendPass,this.zoomBlur=new s.ZoomBlurPass,this.brightnessContrastPass=new s.BrightnessContrastPass,this.width=t||512,this.height=a||512,this.params.blurAmount=20,this.params.applyZoomBlur=!1,this.params.zoomBlurStrength=2,this.params.useTexture=!1,this.params.zoomBlurCenter=new THREE.Vector2(0,0),this.params.blendMode=s.BlendMode.Screen},s.MultiPassBloomPass.prototype=Object.create(s.Pass.prototype),s.MultiPassBloomPass.prototype.isLoaded=function(){return this.blurPass.isLoaded()&&this.blendPass.isLoaded()&&this.zoomBlur.isLoaded()&&(this.loaded=!0),s.Pass.prototype.isLoaded.call(this)},s.MultiPassBloomPass.prototype.run=function(t){this.composer||(this.composer=new s.Composer(t.renderer,{useRGBA:!0}),this.composer.setSize(this.width,this.height)),this.composer.reset(),this.params.useTexture===!0?this.composer.setSource(this.params.glowTexture):this.composer.setSource(t.output),this.blurPass.params.amount=this.params.blurAmount,this.composer.pass(this.blurPass),this.params.applyZoomBlur&&(this.zoomBlur.params.center.set(.5*this.composer.width,.5*this.composer.height),this.zoomBlur.params.strength=this.params.zoomBlurStrength,this.composer.pass(this.zoomBlur)),this.params.useTexture===!0&&(this.blendPass.params.mode=s.BlendMode.Screen,this.blendPass.params.tInput=this.params.glowTexture,t.pass(this.blendPass)),this.blendPass.params.mode=this.params.blendMode,this.blendPass.params.tInput2=this.composer.output,t.pass(this.blendPass)},s.CGAPass=function(){s.Pass.call(this),s.log("CGA Pass constructor"),this.loadShader("cga-fs.glsl",function(){this.shader.uniforms.pixelDensity.value=window.devicePixelRatio})},s.CGAPass.prototype=Object.create(s.Pass.prototype),s.SobelEdgeDetectionPass=function(){s.Pass.call(this),s.log("SobelEdgeDetectionPass Pass constructor"),this.loadShader("sobel-fs.glsl")},s.SobelEdgeDetectionPass.prototype=Object.create(s.Pass.prototype),s.FreiChenEdgeDetectionPass=function(){s.Pass.call(this),s.log("FreiChenEdgeDetectionPass Pass constructor"),this.loadShader("frei-chen-fs.glsl")},s.FreiChenEdgeDetectionPass.prototype=Object.create(s.Pass.prototype),s.DirtPass=function(){s.Pass.call(this),this.blendPass=new s.BlendPass,this.dirtTexture=THREE.ImageUtils.loadTexture(s.assetsPath+"/textures/dirt8.jpg"),this.params.blendMode=s.BlendMode.SoftLight},s.DirtPass.prototype=Object.create(s.Pass.prototype),s.DirtPass.prototype.isLoaded=function(){return this.blendPass.isLoaded()&&(this.loaded=!0),s.Pass.prototype.isLoaded.call(this)},s.DirtPass.prototype.run=function(s){this.blendPass.params.sizeMode=1,this.blendPass.params.mode=this.params.blendMode,this.blendPass.params.tInput2=this.dirtTexture,this.dirtTexture.image&&(this.blendPass.params.resolution2.set(this.dirtTexture.image.width,this.dirtTexture.image.height),this.blendPass.params.aspectRatio2=this.dirtTexture.image.width/this.dirtTexture.image.height),this.blendPass.params.aspectRatio=s.read.width/s.read.height,s.pass(this.blendPass)},s.GuidedBoxBlurPass=function(){s.Pass.call(this),s.log("GuidedBoxBlurPass Pass constructor"),this.loadShader("guided-box-blur2-fs.glsl"),this.params.tBias=null,this.params.delta=new THREE.Vector2(1,0),this.params.invertBiasMap=!1,this.params.isPacked=0,this.params.from=0,this.params.to=1},s.GuidedBoxBlurPass.prototype=Object.create(s.Pass.prototype),s.GuidedBoxBlurPass.prototype.run=function(s){this.shader.uniforms.tBias.value=this.params.tBias,this.shader.uniforms.delta.value.copy(this.params.delta),this.shader.uniforms.delta.value.multiplyScalar(1e-4),this.shader.uniforms.invertBiasMap.value=this.params.invertBiasMap,this.shader.uniforms.isPacked.value=this.params.isPacked,this.shader.uniforms.from.value=this.params.from,this.shader.uniforms.to.value=this.params.to,s.pass(this.shader)},s.GuidedFullBoxBlurPass=function(){s.Pass.call(this),s.log("FullBoxBlurPass Pass constructor"),this.guidedBoxPass=new s.GuidedBoxBlurPass,this.params.tBias=null,this.params.invertBiasMap=!1,this.params.isPacked=0,this.params.amount=10,this.params.from=0,this.params.to=1,this.params.taps=1},s.GuidedFullBoxBlurPass.prototype=Object.create(s.Pass.prototype),s.GuidedFullBoxBlurPass.prototype.isLoaded=function(){return this.guidedBoxPass.isLoaded()&&(this.loaded=!0),s.Pass.prototype.isLoaded.call(this)},s.GuidedFullBoxBlurPass.prototype.run=function(s){this.guidedBoxPass.params.invertBiasMap=this.params.invertBiasMap,this.guidedBoxPass.params.isPacked=this.params.isPacked,this.guidedBoxPass.params.tBias=this.params.tBias,this.guidedBoxPass.params.from=this.params.from,this.guidedBoxPass.params.to=this.params.to;for(var t=this.params.amount,a=0;a<this.params.taps;a++)this.guidedBoxPass.params.delta.set(t,0),s.pass(this.guidedBoxPass),this.guidedBoxPass.params.delta.set(0,t),s.pass(this.guidedBoxPass)},s.PixelatePass=function(){s.Pass.call(this),s.log("PixelatePass Pass constructor"),this.loadShader("pixelate-fs.glsl"),this.params.amount=320},s.PixelatePass.prototype=Object.create(s.Pass.prototype),s.PixelatePass.prototype.run=function(s){this.shader.uniforms.amount.value=this.params.amount,s.pass(this.shader)},s.RGBSplitPass=function(){s.Pass.call(this),s.log("RGBSplitPass Pass constructor"),this.loadShader("rgb-split-fs.glsl",function(){}),this.params.delta=new THREE.Vector2},s.RGBSplitPass.prototype=Object.create(s.Pass.prototype),s.RGBSplitPass.prototype.run=function(s){this.shader.uniforms.delta.value.copy(this.params.delta),s.pass(this.shader)},s.ChromaticAberrationPass=function(){s.Pass.call(this),s.log("ChromaticAberrationPass Pass constructor"),this.loadShader("chromatic-aberration-fs.glsl")},s.ChromaticAberrationPass.prototype=Object.create(s.Pass.prototype),s.BarrelBlurPass=function(){s.Pass.call(this),s.log("BarrelBlurPass Pass constructor"),this.loadShader("barrel-blur-fs.glsl")},s.BarrelBlurPass.prototype=Object.create(s.Pass.prototype),s.OldVideoPass=function(){s.Pass.call(this),s.log("OldVideoPass Pass constructor"),this.loadShader("old-video-fs.glsl")},s.OldVideoPass.prototype=Object.create(s.Pass.prototype),s.DotScreenPass=function(){s.Pass.call(this),s.log("DotScreenPass Pass constructor"),this.loadShader("dot-screen-fs.glsl")},s.DotScreenPass.prototype=Object.create(s.Pass.prototype),s.PoissonDiscBlurPass=function(){s.Pass.call(this),s.log("PoissonDiscBlurPass Pass constructor"),this.loadShader("poisson-disc-blur-fs.glsl")},s.PoissonDiscBlurPass.prototype=Object.create(s.Pass.prototype),s.CircularBlurPass=function(){s.Pass.call(this),s.log("CircularBlurPass Pass constructor"),this.loadShader("circular-blur-fs.glsl")},s.CircularBlurPass.prototype=Object.create(s.Pass.prototype),s.ToonPass=function(){s.Pass.call(this),s.log("ToonPass Pass constructor"),this.loadShader("toon-fs.glsl")},s.ToonPass.prototype=Object.create(s.Pass.prototype),s.FXAAPass=function(){s.Pass.call(this),s.log("FXAA Pass constructor"),this.loadShader("fxaa-fs.glsl")},s.FXAAPass.prototype=Object.create(s.Pass.prototype),s.HighPassPass=function(){s.Pass.call(this),s.log("HighPass Pass constructor"),this.loadShader("high-pass-fs.glsl")},s.HighPassPass.prototype=Object.create(s.Pass.prototype),s.GrayscalePass=function(){s.Pass.call(this),s.log("GrayscalePass Pass constructor"),this.loadShader("grayscale-fs.glsl")},s.GrayscalePass.prototype=Object.create(s.Pass.prototype),s.ASCIIPass=function(){s.Pass.call(this),s.log("ASCIIPass Pass constructor"),this.loadShader("ascii-fs.glsl",function(){this.shader.uniforms.tAscii.value=THREE.ImageUtils.loadTexture(s.assetsPath+"/ascii/8x16_ascii_font_sorted.gif")})},s.ASCIIPass.prototype=Object.create(s.Pass.prototype),s.LEDPass=function(){s.Pass.call(this),s.log("LEDPass Pass constructor"),this.loadShader("led-fs.glsl",function(){}),this.params.pixelSize=10,this.params.tolerance=.25,this.params.pixelRadius=.25,this.params.luminanceSteps=100,this.params.luminanceBoost=.2,this.params.colorBoost=.01,this.params.burntOutPercent=50},s.LEDPass.prototype=Object.create(s.Pass.prototype),s.LEDPass.prototype.run=function(s){this.shader.uniforms.pixelSize.value=this.params.pixelSize,this.shader.uniforms.tolerance.value=this.params.tolerance,this.shader.uniforms.pixelRadius.value=this.params.pixelRadius,this.shader.uniforms.luminanceSteps.value=this.params.luminanceSteps,this.shader.uniforms.luminanceBoost.value=this.params.luminanceBoost,this.shader.uniforms.colorBoost.value=this.params.colorBoost,this.shader.uniforms.burntOutPercent.value=this.params.burntOutPercent,s.pass(this.shader)},s.HalftonePass=function(){s.Pass.call(this),s.log("HalftonePass Pass constructor"),this.loadShader("halftone-fs.glsl",function(){this.shader.uniforms.pixelSize.value=6})},s.HalftonePass.prototype=Object.create(s.Pass.prototype),s.Halftone2Pass=function(){s.Pass.call(this),s.log("Halftone2Pass Pass constructor"),this.loadShader("halftone2-fs.glsl"),this.params.amount=128,this.params.smoothness=.25},s.Halftone2Pass.prototype=Object.create(s.Pass.prototype),s.Halftone2Pass.prototype.run=function(s){this.shader.uniforms.amount.value=this.params.amount,this.shader.uniforms.smoothness.value=this.params.smoothness,s.pass(this.shader)},s.HalftoneCMYKPass=function(){s.Pass.call(this),s.log("HalftoneCMYKPass Pass constructor"),this.loadShader("halftone-cmyk-fs.glsl",function(){})},s.HalftoneCMYKPass.prototype=Object.create(s.Pass.prototype),s.CrossFadePass=function(){s.Pass.call(this),s.log("CrossFadePass Pass constructor"),this.loadShader("crossfade-fs.glsl"),this.params.tInput2=null,this.params.tFadeMap=null,this.params.amount=0},s.CrossFadePass.prototype=Object.create(s.Pass.prototype),s.CrossFadePass.prototype.run=function(s){this.shader.uniforms.tInput2.value=this.params.tInput2,this.shader.uniforms.tFadeMap.value=this.params.tFadeMap,this.shader.uniforms.amount.value=this.params.amount,s.pass(this.shader)},s.SSAOPass=function(){s.Pass.call(this),s.log("SSAOPass Pass constructor"),this.loadShader("ssao-fs.glsl",function(s){}),this.params.texture=null,this.params.isPacked=!1,this.params.onlyOcclusion=!1,this.blurPass=new s.FullBoxBlurPass,this.blendPass=new s.BlendPass,this.composer=null},s.SSAOPass.prototype=Object.create(s.Pass.prototype),s.SSAOPass.prototype.run=function(t){if(!this.composer){var a=4;this.composer=new s.Composer(t.renderer,{useRGBA:!0}),this.composer.setSize(t.width/a,t.height/a)}this.composer.reset(),this.composer.setSource(t.output),this.shader.uniforms.tDepth.value=this.params.texture,this.shader.uniforms.onlyOcclusion.value=this.params.onlyOcclusion,this.composer.pass(this.shader),this.blurPass.params.amount=.1,this.composer.pass(this.blurPass),this.params.onlyOcclusion?t.setSource(this.composer.output):(this.blendPass.params.mode=s.BlendMode.Multiply,this.blendPass.params.tInput2=this.composer.output,t.pass(this.blendPass))},s.SimpleSSAOPass=function(){s.Pass.call(this),s.log("SimpleSSAOPass Pass constructor"),this.loadShader("ssao-simple-fs.glsl",function(s){}),this.params.texture=null,this.params.onlyOcclusion=0,this.params.zNear=1,this.params.zFar=1e4,this.params.strength=1},s.SimpleSSAOPass.prototype=Object.create(s.Pass.prototype),s.SimpleSSAOPass.prototype.run=function(s){this.shader.uniforms.tDepth.value=this.params.texture,this.shader.uniforms.zNear.value=this.params.zNear,this.shader.uniforms.zFar.value=this.params.zFar,this.shader.uniforms.strength.value=this.params.strength,s.pass(this.shader)},s.DirectionalBlurPass=function(){s.Pass.call(this),s.log("Directional Blur Pass constructor"),this.loadShader("guided-directional-blur-fs.glsl",function(s){}),this.params.tBias=null,this.params.delta=.1},s.DirectionalBlurPass.prototype=Object.create(s.Pass.prototype),s.DirectionalBlurPass.prototype.run=function(s){this.shader.uniforms.tBias.value=this.params.tBias,this.shader.uniforms.delta.value=this.params.delta,s.pass(this.shader)},s.BleachPass=function(){s.Pass.call(this),s.log("Bleach Pass constructor"),this.loadShader("bleach-fs.glsl",function(s){}),this.params.amount=1},s.BleachPass.prototype=Object.create(s.Pass.prototype),s.BleachPass.prototype.run=function(s){this.shader.uniforms.amount.value=this.params.amount,s.pass(this.shader)},s.DOFPass=function(){s.Pass.call(this),s.log("DOFPass Pass constructor"),this.loadShader("dof-fs.glsl"),this.params.focalDistance=0,this.params.aperture=.005,this.params.tBias=null,this.params.blurAmount=1},s.DOFPass.prototype=Object.create(s.Pass.prototype),s.DOFPass.prototype.run=function(s){this.shader.uniforms.tBias.value=this.params.tBias,this.shader.uniforms.focalDistance.value=this.params.focalDistance,this.shader.uniforms.aperture.value=this.params.aperture,this.shader.uniforms.blurAmount.value=this.params.blurAmount,this.shader.uniforms.delta.value.set(1,0),s.pass(this.shader),this.shader.uniforms.delta.value.set(0,1),s.pass(this.shader)},window.WAGNER=s,"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=s),exports.WAGNER=s):"undefined"!=typeof define&&define.amd?define(s):this.WAGNER=s}).call(this);