function UserAudio(e,t){this.ctx=e,this.output=t,navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;var i={audio:!0};navigator.getUserMedia(i,this._successCallback.bind(this),this._errorCallback.bind(this))}UserAudio.prototype._successCallback=function(e){this.source=this.ctx.createMediaStreamSource(e),this.source.connect(this.output),this.successCallback()},UserAudio.prototype._errorCallback=function(){console.log("User Media Failed. BOOOOOO!"),this.errorCallback()},UserAudio.prototype.successCallback=function(){},UserAudio.prototype.errorCallback=function(){};