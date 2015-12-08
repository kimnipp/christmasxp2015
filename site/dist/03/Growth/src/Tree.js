function Tree(e){this.params=e;var r=e.material,t=this.createGeo(e),a=new THREE.Mesh(t,r);return a.curves=this.curves,a.cleanCurves=this.cleanCurves,a}Tree.prototype.assignAttributes=function(e,r,t,a,o,l,n){for(var i=0,c=[],s=0;s<a.length;s++){for(var u=[],h=s/(4*o)*2*Math.PI-Math.PI/4,d=((s+.1)/(4*o)*2*Math.PI-Math.PI/4,a[s]),v=d.normal,m=new THREE.Vector3(0,0,1),p=m.dot(v),y=v.clone().multiplyScalar(p),E=m.clone().sub(y),f=E.normalize(),g=v.clone().cross(f),R=0;l>R;R++){var h=R/l*2*Math.PI,w=Math.cos(h),T=Math.sin(h),b=d.radius,z=d.clone(),V=f.clone().multiplyScalar(b*w),M=g.clone().multiplyScalar(b*T);z.add(V),z.add(M),u.push(z)}c.push(u)}for(var s=0;o-1>s;s++)for(var u=c[s],S=c[s+1],R=0;l>R;R++){var H=R+1;H==l&&(H=0);var x=u[R],C=u[H],P=S[R],A=S[H],O=a[s],I=a[s+1],F=x.clone().sub(O).normalize(),B=C.clone().sub(O).normalize(),G=P.clone().sub(I).normalize(),N=A.clone().sub(I).normalize(),D=n+6*(s*l+R)*3,L=n*(2/3)+6*(s*l+R)*2;e[D+0]=x.x,e[D+1]=x.y,e[D+2]=x.z,e[D+3]=C.x,e[D+4]=C.y,e[D+5]=C.z,e[D+6]=A.x,e[D+7]=A.y,e[D+8]=A.z,e[D+9]=A.x,e[D+10]=A.y,e[D+11]=A.z,e[D+12]=P.x,e[D+13]=P.y,e[D+14]=P.z,e[D+15]=x.x,e[D+16]=x.y,e[D+17]=x.z,r[D+0]=F.x,r[D+1]=F.y,r[D+2]=F.z,r[D+3]=B.x,r[D+4]=B.y,r[D+5]=B.z,r[D+6]=N.x,r[D+7]=N.y,r[D+8]=N.z,r[D+9]=N.x,r[D+10]=N.y,r[D+11]=N.z,r[D+12]=G.x,r[D+13]=G.y,r[D+14]=G.z,r[D+15]=F.x,r[D+16]=F.y,r[D+17]=F.z;var x=u[R],C=u[H],P=S[R],A=S[H];t[L+0]=R/l,t[L+1]=s/o,t[L+2]=H/l,t[L+3]=s/o,t[L+4]=H/l,t[L+5]=(s+1)/o,t[L+6]=H/l,t[L+7]=(s+1)/o,t[L+8]=R/l,t[L+9]=(s+1)/o,t[L+10]=R/l,t[L+11]=s/o,i+=18}},Tree.prototype.createCleanCurve=function(e,r){for(var t=[],a=1e-7;r>a;a++){var o=a/r*(e.length-1),l=Math.ceil(o),n=Math.floor(o),i=e[n],c=e[l];l==n&&console.log("NOOO");var s=o-n,u=new THREE.Vector3(0,0,0),h=new THREE.Vector3(0,0,0),d=new THREE.Vector3(0,0,0),v=new THREE.Vector3(0,0,0),m=new THREE.Vector3(0,0,0),p=new THREE.Vector3(0,0,0);0==n?(e[l+1]||console.log(e),u=e[n].clone(),h=e[l].clone(),m=e[l+1].clone(),v=m.clone(),v.sub(u.clone()),v.multiplyScalar(.5)):l==e.length-1?(u=e[n].clone(),h=e[l].clone(),m=e[n-1].clone(),d=h.clone().sub(m),d.multiplyScalar(.5)):(u=e[n].clone(),h=e[l].clone(),m=e[l+1].clone(),p=e[n-1].clone(),v=m.clone(),v.sub(u),v.multiplyScalar(.5),d=h.clone(),d.sub(p),d.multiplyScalar(.5)),d.multiplyScalar(1/3),v.multiplyScalar(1/3),d.multiplyScalar(1),v.multiplyScalar(1);var y=u.clone(),E=u.clone().add(d),f=h.clone().sub(v),g=h.clone(),R=this.cubicCurve(s,y,E,f,g),w=this.cubicCurve(s+.01,y,E,f,g);R.normal=w.sub(R).normalize(),R.radius=i.radius+(c.radius-i.radius)*s,t.push(R)}return t},Tree.prototype.cubicCurve=function(e,r,t,a,o){var l=1-e,n=r.clone().multiplyScalar(l*l*l),i=t.clone().multiplyScalar(3*l*l*e),c=a.clone().multiplyScalar(3*l*e*e),s=o.clone().multiplyScalar(e*e*e),u=new THREE.Vector3;return u.add(n),u.add(i),u.add(c),u.add(s),u},Tree.prototype.createGeo=function(e){var r=_.defaults(e||{},{radius:1,height:10,sides:10,numOf:19,randomness:1,slices:100,startingChance:2,chanceReducer:.9,randomnessReducer:.9,sliceReducer:.7,numOfReducer:.7,progressionPower:1.4,lengthReduction:.5,maxIterations:3,maxVerts:1e5}),t=[];this.curves=t,this.totalPoints=0,this.totalClean=0,this.totalVerts=0;var a=new THREE.Vector3,o=new THREE.Vector3(0,r.height,0);this.createTreeCurve(0,r.radius,a,o,r);for(var l=[],n=0,i=0;i<t.length;i++)if(t[i][1].length<3)console.log("NOPE");else{var c=Math.floor(r.slices*Math.pow(r.sliceReducer,t[i][0]));n+=c-1,l.push([c,this.createCleanCurve(t[i][1],c)])}var s=n*r.sides*6*3,u=new THREE.BufferGeometry;u.totalVerts=s;var h=new THREE.BufferAttribute(new Float32Array(3*s),3),d=new THREE.BufferAttribute(new Float32Array(3*s),3),v=new THREE.BufferAttribute(new Float32Array(2*s),2);u.addAttribute("position",d),u.addAttribute("normal",h),u.addAttribute("uv",v);var m=u.getAttribute("position").array,p=u.getAttribute("normal").array,y=u.getAttribute("uv").array,E=0;this.cleanCurves=l;for(var i=0;i<l.length;i++)this.assignAttributes(m,p,y,l[i][1],l[i][0],r.sides,E),E+=(l[i][0]-1)*r.sides*6*3;return u},Tree.prototype.createTreeCurve=function(e,r,t,a,o){var l=o,n=e;if(e!=l.maxIterations){var i=Math.floor(l.slices*Math.pow(l.sliceReducer,e)),c=(this.totalClean+(i-1),this.totalVerts+(i-1)*l.sides*6);if(!(c>l.maxVerts)){var s=a.clone().sub(t),u=[],h=Math.pow,d=Math.floor,v=d(l.numOf*h(l.numOfReducer,n)),m=d(l.randomness*h(l.randomnessReducer,n)),p=d(l.startingChance*h(l.chanceReducer,n));if(3>v)return void console.log("numoftoosmall");var i=Math.floor(l.slices*Math.pow(l.sliceReducer,e));this.totalClean+=i-1,this.totalVerts+=(i-1)*l.sides*6;var y=!1;this.totalVerts>l.maxVerts&&(console.log("FOR THE LOVE OF GOD NO MORE"),y=!0);for(var n=0;v>n;n++){var E=v-1,f=(E-n)/E,g=t.clone().add(s.clone().multiplyScalar(1-f));if(0!=n){var R=new THREE.Vector3,w=m;R.x=(Math.random()-.5)*w*f,R.y=(Math.random()-.5)*w*f,R.z=(Math.random()-.5)*w*f,g.add(R)}var T=new THREE.Vector3;T.copy(g),T.sub(o.lightPosition);var b=T.length();if(b<o.lightSize){var z=new THREE.Vector3;z.copy(o.lightPosition),T.normalize(),T.multiplyScalar(1.1*o.lightSize),z.add(T),g.copy(z)}g.radius=f*r,u.push(g)}this.curves.push([e,u]),this.totalPoints+=u.length;for(var n=v-1;n>=0;n--)if(y===!1){var V=Math.random(),M=n/v,S=p*Math.pow(M,l.progressionPower),g=u[n];if(S>V){var H=new THREE.Vector3;H.copy(g);var x=s.clone();x.normalize();var C=new THREE.Vector3;C.copy(this.params.lightPosition),C.sub(g),C.multiplyScalar(.1),0!==n&&(x.copy(g),x.sub(u[n-1]),x.normalize(),x.add(C),x.normalize(),x.y*=o.flattening,x.normalize());var P=H.clone(),E=v-1,f=(E-n)/E;x.multiplyScalar(s.length()*l.lengthReduction),P.add(x);var T=new THREE.Vector3;T.copy(P),T.sub(o.lightPosition);var b=T.length();if(b<o.lightSize){var z=new THREE.Vector3;z.copy(o.lightPosition),T.normalize(),T.multiplyScalar(1.1*o.lightSize),z.add(T),P.copy(z)}this.createTreeCurve(e+1,r*f,H,P,o)}}}}};