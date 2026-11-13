/*
 * Black Hole Gateway — standalone, dependency-free WebGL2 rendering.
 * Physically inspired Schwarzschild null-ray bending, differential disk flow,
 * Doppler brightening, turbulent emission and localized flares. Optional QG
 * radiative anomalies are deliberately speculative, NOT physical predictions.
 * Cinematic visualization, not a validated GR/MHD or quantum-gravity model.
 * Copyright (c) 2026, portfolio owner. All rights reserved.
 */
(() => {
  'use strict';

  const canvas = document.getElementById('blackhole-gateway-canvas');
  const gate = document.getElementById('blackhole-entry');
  const enter = document.getElementById('blackhole-enter');
  const destination = document.getElementById('home-content');
  if (!gate || !canvas || !enter || !destination) return;

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function enterSite(event) {
    if (event) event.preventDefault();
    if (!root.classList.contains('bh-gated')) {
      destination.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
      return;
    }
    root.classList.remove('bh-gated');
    root.classList.add('bh-entered');
    document.dispatchEvent(new Event('blackhole:enter'));
    // Leave enough time for the header's visibility transition before the scroll.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      destination.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
      enter.blur();
    }));
  }
  enter.addEventListener('click', enterSite);

  // For browser navigation back to an anchored section, do not show the entrance gate.
  if (location.hash && location.hash !== '#blackhole-entry') {
    root.classList.remove('bh-gated');
    root.classList.add('bh-entered');
  }

  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: false, depth: false, stencil: false,
    preserveDrawingBuffer: false, powerPreference: 'high-performance',
  });
  const fallback = () => {
    const cx = canvas.getContext('2d');
    if (!cx) return;
    const rect = gate.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    canvas.width = w; canvas.height = h;
    const bg = cx.createRadialGradient(w*.50, h*.39, 0, w*.50, h*.39, Math.max(w,h)*.55);
    bg.addColorStop(0, '#171011'); bg.addColorStop(.55, '#06080d'); bg.addColorStop(1, '#010208');
    cx.fillStyle = bg; cx.fillRect(0,0,w,h);
    const r = Math.min(w,h)*.18, x=w*.52, y=h*.38;
    cx.save(); cx.translate(x,y);
    for(let i=17;i>=0;i--){
      cx.beginPath(); cx.ellipse(0, 0, r*(1.33+i*.055), r*(.29+i*.021), -.05, 0, 2*Math.PI);
      cx.strokeStyle = `rgba(255,${155+i*2},${65+i*2},${(.015+(18-i)*.004).toFixed(3)})`;
      cx.lineWidth = 1.7+i*.15; cx.stroke();
    }
    const rim = cx.createRadialGradient(0,0,r*.95,0,0,r*1.15);
    rim.addColorStop(0,'#000'); rim.addColorStop(.84,'#000'); rim.addColorStop(.95,'#6b442c'); rim.addColorStop(1,'rgba(0,0,0,0)');
    cx.fillStyle = rim; cx.beginPath(); cx.arc(0,0,r*1.15,0,Math.PI*2); cx.fill();
    cx.restore();
  };
  if(!gl){ fallback(); return; }

  const vertex = `#version 300 es
  precision highp float;
  out vec2 v_uv;
  void main() {
    vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
    v_uv = p * 0.5;
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
  }`;

  const fragment = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_qg;

#define PI 3.141592653589793
#define TAU 6.283185307179586
const float rs = 1.0;              // Schwarzschild radius (2GM/c^2) as unit
const float isco = 3.04;          // Schwarzschild ISCO in rs units
const float diskMax = 12.7;
const float bcrit = 2.598076211; // photon-sphere critical impact parameter

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x+p3.y)*p3.z);
}
float noise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash12(i),hash12(i+vec2(1.0,0.0)),f.x),
             mix(hash12(i+vec2(0.0,1.0)),hash12(i+vec2(1.0,1.0)),f.x),f.y);
}
float fbm(vec2 p) {
  float a = .5, s=0.0;
  for (int k=0;k<4;k++) {
    s += a*noise2(p);
    p = mat2(1.59, -.93, .93, 1.59)*p + vec2(3.1,8.7);
    a *= .5;
  }
  return s;
}
float angDist(float a, float b) { return atan(sin(a-b),cos(a-b)); }
float gaussian(float x, float width) { float q=x/width; return exp(-q*q); }
float pulse(float sec,float cycle,float start,float duration) {
  float phase=mod(sec,cycle);
  float age=phase-start;
  float rise=smoothstep(0.0,.19,age);
  float fall=1.0-smoothstep(duration*.45,duration,age);
  return rise*fall;
}
float flareA(float t){ return pulse(t,37.0,9.5,1.55); }
float flareB(float t){ return pulse(t,37.0,26.8,.88); }

// Textured and extremely dim sky. All of its stars are sampled from the
// outgoing ray, so the lensing follows the deflection rather than a fake warp.
vec3 distantSky(vec3 v) {
  vec3 sky=vec3(.0007,.0012,.0024);
  float latitude = abs(v.y*.82 + v.x*.16 + v.z*.10);
  float milky=exp(-latitude*11.0);
  float nebula=fbm(v.xz*10.5+vec2(v.y*4.0));
  sky += milky * smoothstep(.41,.79,nebula)*vec3(.015,.013,.018);
  sky += vec3(.0025,.0038,.0050)*fbm(v.xy*5.4);

  vec2 uv=vec2(atan(v.z,v.x)/TAU,asin(clamp(v.y,-1.0,1.0))/PI);
  vec2 g=uv*vec2(1120.0,560.0);
  vec2 cell=floor(g), frac=fract(g)-.5;
  float chance=hash12(cell);
  float star=1.0-smoothstep(.016,.095,length(frac));
  float brightness=smoothstep(.9977,.9999,chance);
  sky += vec3(.72,.81,1.0)*brightness*star*(.3+.7*hash12(cell+46.7));
  return sky;
}

// Procedural texture advected by a differential (Keplerian) angular field.
// This is not MHD simulation; it provides continuously orbiting, turbulent light.
vec3 accretionRadiance(vec3 pt, vec3 viewRay, float t) {
  float r = length(pt.xz);
  if (r < isco || r > diskMax) return vec3(0.0);
  float a=atan(pt.z,pt.x);
  float omega=.36*pow(isco/r,1.5);
  float phase=a-t*omega;
  float shear=phase-2.35*log(r/isco);

  float coarse=fbm(vec2(shear*3.6,r*.92));
  float small=fbm(vec2(shear*12.5 + coarse*1.9,r*2.15));
  float ridges=sin(shear*17.5+r*2.1+coarse*4.8);
  ridges=.5+.5*ridges;
  float density=.20+.52*small+.39*coarse+.23*pow(ridges,2.5);
  float knot=fbm(vec2(phase*5.4,r*3.9+coarse*.45));
  density *= .73+.56*smoothstep(.31,.75,knot);

  float radial=pow(isco/r,2.0);
  radial *= smoothstep(isco,isco+.62,r);
  radial *= 1.0-smoothstep(diskMax-3.5,diskMax,r);

  vec3 azimuthalVelocity=normalize(vec3(-pt.z,0.0,pt.x));
  float beta=clamp(sqrt(.67/r),.0,.55);
  float mu=dot(azimuthalVelocity,-viewRay);
  float doppler=sqrt(1.0-beta*beta)/max(.25,1.0-beta*mu);
  float redshift=sqrt(max(.15,1.0-rs/r));
  float heat=pow(isco/r,.60)*doppler*redshift;
  float intensity=pow(doppler,3.8)*radial*density;

  vec3 rust=vec3(.47,.085,.012);
  vec3 amber=vec3(1.05,.29,.050);
  vec3 gold=vec3(1.35,.79,.30);
  vec3 whiteHot=vec3(2.4,1.92,1.38);
  vec3 spectral=mix(rust,amber,smoothstep(.23,.68,heat));
  spectral=mix(spectral,gold,smoothstep(.57,1.02,heat));
  spectral=mix(spectral,whiteHot,smoothstep(.83,1.36,heat));

  // Coherent orbiting hot spots. Their differential angular speeds follow
  // a Keplerian radial scaling, not a decorative rotation of the whole image.
  float spot1=gaussian(r-3.82,.41)*gaussian(angDist(a,t*.28+.4),.22);
  float spot2=gaussian(r-4.74,.51)*gaussian(angDist(a,t*.19+2.85),.19);
  float spot3=gaussian(r-5.78,.62)*gaussian(angDist(a,t*.15+5.12),.23);
  float hotSpots=.70*spot1+.43*spot2+.25*spot3;

  // Rare local magnetic-reconnection-style outbursts.
  float flash1=flareA(t)*gaussian(r-3.82,.52)*gaussian(angDist(a,t*.28+.4),.30);
  float flash2=flareB(t)*gaussian(r-4.67,.55)*gaussian(angDist(a,t*.19+2.85),.28);
  float magneticFlares=flash1*4.5+flash2*3.4;
  intensity *= 1.0+hotSpots*1.8;
  vec3 radiance=spectral*intensity*2.85;
  radiance += vec3(2.35,1.53,.89)*magneticFlares;
  return radiance;
}

void main(){
  // The camera is fixed: stability is essential for an observational look.
  vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
  float aspect=u_resolution.x/u_resolution.y;
  // On portrait phones, widen the field of view so the shadow and lensing arc
  // remain visible instead of cropping into an enormous black disk.
  float portraitFactor=1.0-smoothstep(.45,.95,aspect);
  float portraitScale=1.0+1.08*portraitFactor;
  p*=portraitScale;
  p.y+=mix(.13,-.15,portraitFactor);

  vec3 ro=vec3(0.0,3.25,18.5);
  vec3 forward=normalize(-ro);
  vec3 right=normalize(cross(forward,vec3(0.0,1.0,0.0)));
  vec3 up=normalize(cross(right,forward));
  vec3 rd=normalize(forward*1.82+right*p.x+up*p.y);
  vec3 pos=ro, dir=rd;
  float L2=dot(cross(ro,rd),cross(ro,rd));
  float b=sqrt(L2);
  bool swallowed=false;
  float prevY=pos.y;
  float alpha=1.0;
  vec3 radiance=vec3(0.0);

  // Null-ray spatial projection in Schwarzschild geometry. The projected
  // light-bending force is integrated adaptively, and the ray can cross the
  // disk multiple times, producing a secondary gravitationally lensed image.
  for(int i=0; i<160; i++){
    float r=length(pos);
    if(r<1.018){swallowed=true; break;}
    if(r>34.0 && dot(pos,dir)>0.0) break;
    float stepSize=clamp(r*.088,.037,.38);
    vec3 accel=pos*(-1.5*rs*L2/max(pow(r,5.0),.0003));
    vec3 nextDir=dir+accel*stepSize;
    vec3 nextPos=pos+(dir+nextDir)*.5*stepSize;
    vec3 midRay=normalize((dir+nextDir)*.5);

    if((prevY>0.0 && nextPos.y<=0.0) || (prevY<0.0 && nextPos.y>=0.0)){
      float crossing=clamp(prevY/(prevY-nextPos.y),0.0,1.0);
      vec3 hit=mix(pos,nextPos,crossing);
      float hr=length(hit.xz);
      if(hr>=isco && hr<=diskMax){
        vec3 material=accretionRadiance(hit,midRay,u_time);
        radiance+=alpha*material;
        float opticalDepth=.13+.34*smoothstep(.12,2.9,length(material));
        alpha*=1.0-opticalDepth;
      }
    }
    dir=nextDir;
    pos=nextPos;
    prevY=pos.y;
  }
  vec3 col=radiance;
  if(!swallowed) col += distantSky(dir)*alpha;

  // Small photon-ring contribution tied to near-critical geodesics.
  // The ring is emphatically NOT a large uniform neon circle.
  float ring=gaussian(b-bcrit,.047);
  float angle=atan(p.y,p.x);
  float ringVisibility=.015 + .042*smoothstep(.12,1.4,length(radiance));
  float approach=.45+.55*smoothstep(-.9,.85,p.x*3.0);
  col += ring*ringVisibility*approach*vec3(.45,.25,.105);

  // Speculative 'QG signatures': only a tiny radiative modulation near the
  // critical curve, NOT any claimed observation or actual modified metric.
  // u_qg=0: none, =1: restrained artistic hypothesis, =2: demonstration.
  if(u_qg>0.0){
    float strength=u_qg==1.0 ? .013 : .045;
    float ripple=sin(angle*17.0+u_time*.69+sin(angle*7.0-u_time*.21)*.7);
    ripple += .44*sin(angle*29.0-u_time*1.12);
    float micro=gaussian(b-bcrit,.065)*(0.5+.5*ripple);
    col += vec3(.65,.61,.52)*micro*strength;

    float echo=gaussian(b-(bcrit+.095),.030);
    float delayed=pulse(u_time-1.25,37.0,9.5,1.0)*.52 +
                  pulse(u_time-.8,37.0,26.8,.64)*.35;
    col += vec3(.40,.50,.63)*echo*delayed*strength*.50;
  }

  // Small, localized photographic light bloom around the hot inner flow;
  // the rest of the image stays dark, so there are no full-screen flashes.
  float flareGlow=(flareA(u_time)*.60+flareB(u_time)*.40);
  vec2 hotspotProjected=vec2(.15*cos(u_time*.28+.4), -.15+.07*sin(u_time*.28+.4));
  float pointSpread=gaussian(length((p-hotspotProjected)*vec2(1.05,1.25)),.23);
  col += flareGlow*pointSpread*vec3(.13,.055,.015);

  // Film-like tone mapping; avoid clipping the inner-disk structure to white.
  col=max(col,vec3(0.0));
  col=col*(2.51*col+.03)/(col*(2.43*col+.59)+.14);
  col=pow(clamp(col,0.0,1.0),vec3(.91));
  float vignette=smoothstep(1.40,.30,length(p/vec2(max(1.0,aspect*.55),1.0)));
  col*=mix(.69,1.0,vignette);
  // Low-amplitude dithering hides color banding in the warm corona.
  float d=(hash12(gl_FragCoord.xy)-.5)/255.0;
  fragColor=vec4(clamp(col+d,0.0,1.0),1.0);
}`;

  function compile(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) {
      console.warn('Black-hole shader failed:',gl.getShaderInfoLog(s));
      gl.deleteShader(s); return null;
    }
    return s;
  }
  const vs=compile(gl.VERTEX_SHADER,vertex);
  const fs=compile(gl.FRAGMENT_SHADER,fragment);
  if(!vs || !fs) { gate.classList.add('bh-render-fallback'); return; }
  const program=gl.createProgram();
  gl.attachShader(program,vs);gl.attachShader(program,fs);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) {
    console.warn('Black-hole shader link failed:',gl.getProgramInfoLog(program));
    gate.classList.add('bh-render-fallback'); return;
  }
  gl.useProgram(program);
  gl.deleteShader(vs);gl.deleteShader(fs);
  const uResolution=gl.getUniformLocation(program,'u_resolution');
  const uTime=gl.getUniformLocation(program,'u_time');
  const uQG=gl.getUniformLocation(program,'u_qg');
  const params=new URLSearchParams(location.search);
  const mode=(params.get('qg')||'subtle').toLowerCase();
  const qgMode=mode==='off' ? 0 : (mode==='enhanced' ? 2 : 1);
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);

  let visible = true;
  let stopped = false;
  let previousTime = 0;
  let raf = 0;
  const startTime = performance.now();
  const frameInterval = 1000/24;
  // Optional ?quality=low|balanced|high. Balanced favors a MacBook Air GPU.
  const renderQuality=(new URLSearchParams(location.search).get('quality')||'balanced').toLowerCase();
  const maxWidth=renderQuality==='high' ? 1320 : renderQuality==='low' ? 720 : 1000;
  const maxHeight=renderQuality==='high' ? 900 : renderQuality==='low' ? 500 : 690;
  function resize() {
    const box=gate.getBoundingClientRect();
    const scale = Math.min(1, maxWidth/Math.max(1,box.width), maxHeight/Math.max(1,box.height));
    const width=Math.max(2,Math.round(box.width*scale));
    const height=Math.max(2,Math.round(box.height*scale));
    if(canvas.width!==width || canvas.height!==height){
      canvas.width=width;canvas.height=height;
      gl.viewport(0,0,width,height);
    }
    render(reduced?0:(performance.now()-startTime)*.001);
  }
  function render(seconds) {
    gl.useProgram(program);
    gl.uniform2f(uResolution,canvas.width,canvas.height);
    gl.uniform1f(uTime,seconds);
    gl.uniform1f(uQG,qgMode);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function frame(now) {
    raf=0;
    if(stopped || document.hidden || !visible || reduced) return;
    if(now-previousTime >= frameInterval){
      previousTime=now;
      render((now-startTime)*.001);
    }
    raf=requestAnimationFrame(frame);
  }
  function queueFrame(){if(!raf && !stopped && !reduced && visible && !document.hidden) raf=requestAnimationFrame(frame);}
  const io=new IntersectionObserver((entries)=>{
    visible=entries[0].isIntersecting;
    if(visible) queueFrame();
    else if(raf){ cancelAnimationFrame(raf);raf=0; }
  },{threshold:0.01});
  io.observe(gate);
  document.addEventListener('visibilitychange',queueFrame);
  window.addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('webglcontextlost',(e)=>{
    e.preventDefault();stopped=true;
    if(raf) cancelAnimationFrame(raf);
    gate.classList.add('bh-render-fallback');
  });
  resize();
  queueFrame();
})();
