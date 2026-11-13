/*
 * Black Hole Gateway — standalone, dependency-free WebGL2 rendering.
 * Physically inspired Schwarzschild null-ray tracing. Approximate disk radiance;
 * this is a cinematic visualization, not a validated scientific simulation.
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
    // High-quality, continuously animated Canvas 2D fallback for devices that
    // restrict WebGL (and for automated / privacy-hardened browsers).
    const cx=canvas.getContext('2d',{alpha:false});
    if(!cx) return;
    const TAU=Math.PI*2;
    let w=0,h=0,scale=1,stars=[],dust=[],active=true,raf=0;
    let last=0;
    const random=(a,b)=>a+Math.random()*(b-a);
    const light=(r,g,b,a)=>`rgba(${r},${g},${b},${a})`;

    const resizeCanvas=()=>{
      const rect=gate.getBoundingClientRect();
      w=Math.max(320,Math.floor(rect.width));
      h=Math.max(400,Math.floor(rect.height));
      // Lower fallback resolution on large screens to preserve battery.
      scale=Math.min(1,1100/w,800/h);
      canvas.width=Math.round(w*scale);
      canvas.height=Math.round(h*scale);
      cx.setTransform(scale,0,0,scale,0,0);
      stars=Array.from({length:Math.min(240,Math.floor(w*h/4100))},()=>({
        x:random(0,w),y:random(0,h),r:random(.3,1.25),a:random(.2,.8),p:random(0,TAU)
      }));
      dust=Array.from({length:700},()=>({
        radius:random(1.27,3.0),angle:random(0,TAU),size:random(.35,1.75),
        phase:random(0,TAU),light:random(.25,1)
      }));
      draw(0);
    };

    function arc(cx0,cy0,rx,ry,stroke,width=1,blur=0,top=false){
      cx.save();
      cx.strokeStyle=stroke;
      cx.lineWidth=width;
      if(blur){cx.shadowColor=stroke;cx.shadowBlur=blur;}
      cx.beginPath();
      if(top) {
        cx.moveTo(cx0-rx,cy0);
        cx.bezierCurveTo(cx0-rx*.64,cy0-ry*.12,cx0-rx*.55,cy0-ry*2.0,cx0,cy0-ry*2.06);
        cx.bezierCurveTo(cx0+rx*.55,cy0-ry*2.0,cx0+rx*.68,cy0-ry*.12,cx0+rx,cy0);
      } else {
        cx.ellipse(cx0,cy0,rx,ry,-.04,0,TAU);
      }
      cx.stroke();cx.restore();
    }
    function draw(ms){
      if(!w||!h)return;
      const t=ms*.00011;
      const bx=w*.50,by=h*.375;
      const radius=Math.min(w,h)*.15;
      const extent=radius*2.95;
      const sky=cx.createRadialGradient(bx,by,radius*.1,bx,by,Math.max(w,h)*.7);
      sky.addColorStop(0,'#130c0d');sky.addColorStop(.26,'#0a080e');
      sky.addColorStop(.68,'#04060c');sky.addColorStop(1,'#010207');
      cx.fillStyle=sky;cx.fillRect(0,0,w,h);
      // almost imperceptible galactic dust, not neon nebula effects
      for(const st of stars){
        const distance=Math.hypot(st.x-bx,st.y-by);
        if(distance<radius*.98)continue;
        const tw=st.a*(.83+.17*Math.sin(t*2+st.p));
        cx.fillStyle=light(225,220,214,tw);
        cx.beginPath();cx.arc(st.x,st.y,st.r,0,TAU);cx.fill();
      }
      // broad disk haze, smoothly feathered
      cx.save();cx.translate(bx,by);
      cx.scale(1,.29);
      const glow=cx.createRadialGradient(0,0,radius*.97,0,0,extent*1.2);
      glow.addColorStop(0,'rgba(255,215,145,.29)');
      glow.addColorStop(.27,'rgba(231,123,51,.16)');
      glow.addColorStop(.63,'rgba(125,54,23,.07)');
      glow.addColorStop(1,'rgba(0,0,0,0)');
      cx.fillStyle=glow;cx.beginPath();cx.arc(0,0,extent*1.2,0,TAU);cx.fill();
      cx.restore();

      // Gravitationally lensed rear portion of the accretion disk.
      for(let i=28;i>=0;i--){
        const frac=i/28;
        const rx=radius*(1.19+frac*1.19);
        const ry=radius*(.62+frac*.28);
        arc(bx,by+radius*.20,rx,ry,
          light(246,Math.floor(160+frac*26),Math.floor(100+frac*18),.013+(1-frac)*.085),
          1.2+(1-frac)*2.6, i===0?16:0,true);
      }
      // Backside granular material follows the same curved orbital silhouette.
      for(const particle of dust){
        const a=particle.angle + t/Math.pow(particle.radius,1.5);
        if(Math.sin(a)>0)continue;
        const rr=radius*particle.radius;
        const xx=bx+Math.cos(a)*rr*1.48;
        const lift=Math.sqrt(Math.max(0,1-Math.pow(Math.cos(a),2)));
        const yy=by+radius*.20-radius*(.65+.16*(particle.radius-1.25))*lift;
        const strength=.05+particle.light*.11;
        cx.fillStyle=light(255,181,93,strength);
        cx.beginPath();cx.arc(xx,yy,particle.size*.6,0,TAU);cx.fill();
      }

      // A barely visible photon-ring halo around a truly opaque black center.
      const halo=cx.createRadialGradient(bx,by,radius*.92,bx,by,radius*1.21);
      halo.addColorStop(0,'#000');halo.addColorStop(.74,'#000');
      halo.addColorStop(.84,'rgba(4,3,4,1)');halo.addColorStop(.92,'rgba(232,160,92,.19)');
      halo.addColorStop(1,'rgba(231,159,89,0)');
      cx.fillStyle=halo;cx.beginPath();cx.arc(bx,by,radius*1.22,0,TAU);cx.fill();
      cx.beginPath();cx.arc(bx,by,radius*.975,0,TAU);cx.fillStyle='#000';cx.fill();
      arc(bx,by,radius*.996,radius*.996,'rgba(255,215,151,.29)',1,5);

      // Luminous foreground disk. Start with optically thin broad strokes.
      for(let i=27;i>=0;i--){
        const frac=i/27;
        const rx=radius*(1.18+frac*1.80);
        const ry=radius*(.23+frac*.10);
        const bright=(1-frac);
        arc(bx,by+radius*.185,rx,ry,
          light(255,Math.floor(156+bright*74),Math.floor(74+bright*90),.018+bright*.075),
          .8+bright*3.9,i===0?14:0,false);
      }
      // Moving filaments, each projected into a flattened orbit.
      for(const particle of dust){
        const a=particle.angle + t/Math.pow(particle.radius,1.5);
        if(Math.sin(a)<0)continue;
        const rr=radius*particle.radius;
        const xx=bx+Math.cos(a)*rr*1.48;
        const yy=by+radius*.185+Math.sin(a)*rr*.285;
        const hot=1-Math.min(1,(particle.radius-1.26)/1.74);
        const approaching=.65+.35*Math.cos(a-.2);
        cx.fillStyle=light(255,Math.floor(153+hot*79),Math.floor(80+hot*97),
          (.09+.32*hot)*approaching*particle.light);
        cx.beginPath();cx.arc(xx,yy,particle.size*(.7+hot*.35),0,TAU);cx.fill();
      }
      // Central luminous stream crossing the foreground of the shadow.
      const gr=cx.createLinearGradient(bx-extent,by,bx+extent,by);
      gr.addColorStop(0,'rgba(166,62,25,0)');
      gr.addColorStop(.18,'rgba(246,140,52,.19)');
      gr.addColorStop(.40,'rgba(255,214,132,.62)');
      gr.addColorStop(.62,'rgba(255,245,199,.70)');
      gr.addColorStop(.84,'rgba(255,164,70,.20)');
      gr.addColorStop(1,'rgba(155,58,20,0)');
      arc(bx,by+radius*.185,radius*1.25,radius*.28,gr,radius*.065,13);

      const vignette=cx.createRadialGradient(w*.5,h*.43,w*.12,w*.5,h*.43,Math.max(w,h)*.7);
      vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.6)');
      cx.fillStyle=vignette;cx.fillRect(0,0,w,h);
    }
    function fallbackFrame(now){
      if(!active || document.hidden || reduced){raf=0;return;}
      if(now-last>1000/24){last=now;draw(now);}
      raf=requestAnimationFrame(fallbackFrame);
    }
    const observer=new IntersectionObserver(entries=>{
      active=entries[0].isIntersecting;
      if(!active && raf){cancelAnimationFrame(raf);raf=0;}
      else if(active && !raf && !reduced)raf=requestAnimationFrame(fallbackFrame);
    },{threshold:.01});
    observer.observe(gate);
    window.addEventListener('resize',resizeCanvas,{passive:true});
    resizeCanvas();
    if(!reduced)raf=requestAnimationFrame(fallbackFrame);
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

  #define PI 3.141592653589793
  const float rs = 1.0;                 // Schwarzschild radius in scene units
  const float innerR = 3.05;            // near the Schwarzschild ISCO
  const float outerR = 12.0;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x+p3.y)*p3.z);
  }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p);
    f=f*f*(3.0-2.0*f);
    return mix(mix(hash12(i),hash12(i+vec2(1,0)),f.x),
               mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, amp = 0.5;
    for(int i=0;i<4;i++) {
      v += amp*noise(p);
      p = mat2(1.62,-1.12,1.12,1.62)*p;
      amp *= .5;
    }
    return v;
  }
  vec3 background(vec3 dir) {
    // The star field is sampled from the *outgoing* ray direction, so the black
    // hole visibly deflects the background. Keep the sky almost black.
    vec3 col = vec3(.0010,.0017,.0040);
    float latitude = abs(dir.y*.80 + dir.x*.23 + dir.z*.11);
    float dust = exp(-latitude*9.0);
    float cloud = fbm(dir.xz*12.0 + vec2(dir.y*5.0));
    col += vec3(.014,.012,.015) * dust * smoothstep(.35,.77,cloud);
    col += vec3(.004,.006,.009) * fbm(dir.xy*5.5);

    vec2 uv = vec2(atan(dir.z,dir.x)/(2.0*PI), asin(clamp(dir.y,-1.0,1.0))/PI);
    vec2 g = uv*vec2(980.0,490.0);
    vec2 id = floor(g), f = fract(g)-.5;
    float chance = hash12(id);
    float star = 1.0-smoothstep(.005,.095,length(f));
    float bright = smoothstep(.994,.9999,chance);
    col += vec3(.65,.72,.91) * star * bright * (0.12+0.68*hash12(id+49.0));
    float farStar = 1.0-smoothstep(.035,.28,length(f));
    col += vec3(.32,.31,.33) * farStar * step(.989,chance) * .025;
    return col;
  }

  vec3 diskEmission(vec3 hit, vec3 ray, float t, float dist) {
    float r = length(hit.xz);
    if(r<innerR || r>outerR) return vec3(0.0);
    float angle = atan(hit.z,hit.x);
    float spin = t*0.12 * pow(innerR/max(r,innerR),1.5);
    float twist = angle + spin - 5.8*log(r/innerR);
    float fine = fbm(vec2(twist*11.0, r*3.0));
    float broad = fbm(vec2(twist*3.2, r*.8));
    float lanes = .5+.5*sin(angle*18.0 - r*7.2 + spin*24.0 + fine*3.5);
    float turbulence = clamp(.24 + fine*.75 + broad*.45 + lanes*.24,0.0,1.8);
    float fading = pow(innerR/r,2.3) * (1.0-smoothstep(outerR-2.8,outerR,r));
    fading *= smoothstep(innerR,innerR+.50,r);

    // Keplerian velocity and approximate beaming toward the observer.
    vec3 orbitVelocity = normalize(vec3(-hit.z,0.0,hit.x));
    float beta = clamp(sqrt(0.5/r),0.0,.50);
    float mu = dot(orbitVelocity,-ray);
    float doppler = sqrt(1.0-beta*beta)/(1.0-beta*mu);
    float gravRedshift = sqrt(max(.0,1.0-rs/r));
    float shift = doppler * gravRedshift;
    float boost = pow(doppler,3.0);

    float heat = pow(innerR/r,0.7)*shift;
    vec3 outer = vec3(.65,.16,.035);
    vec3 mid = vec3(1.00,.40,.105);
    vec3 inner = vec3(1.0,.89,.68);
    vec3 color = mix(outer,mid,smoothstep(.35,.83,heat));
    color = mix(color,inner,smoothstep(.72,1.22,heat));

    // Black transparent streaks interleaved with bright turbulent filaments.
    float filaments = smoothstep(.33,.82,turbulence);
    float density = fading * (.20 + .80*filaments) * boost;
    density *= (0.88 + 0.12*sin(r*19.0 + fine*5.0));
    return color * density * 2.25;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - .5*u_resolution)/u_resolution.y;
    float aspect = u_resolution.x/u_resolution.y;
    // Frame the shadow slightly above center, with only quiet negative space below.
    p.y += .10;
    p.x -= .015*min(aspect,1.6);
    vec3 ro = vec3(0.0, 3.3, 18.5);
    vec3 target = vec3(0.0,0.0,0.0);
    vec3 forward = normalize(target-ro);
    vec3 right = normalize(cross(forward,vec3(0.0,1.0,0.0)));
    vec3 up = normalize(cross(right,forward));
    vec3 rd = normalize(forward*1.82 + right*p.x + up*p.y);
    vec3 pos = ro;
    vec3 dir = rd;

    float L2 = dot(cross(ro,rd),cross(ro,rd));
    vec3 accumulated = vec3(0.0);
    float transmittance = 1.0;
    float previousSide = pos.y;
    bool swallowed = false;
    bool escaped = false;

    // Integrate a null-geodesic spatial projection in Schwarzschild coordinates.
    // x'' = -(3/2) rs L^2 x / r^5, valid for this affine projection.
    for(int i=0;i<158;i++) {
      float r=length(pos);
      if(r <= 1.018) { swallowed = true; break; }
      float stepLen = clamp(r*.095,.045,.42);
      float accScale = -1.5*rs*L2 / max(pow(r,5.0),.001);
      vec3 acc = pos * accScale;
      vec3 nextDir = dir + acc*stepLen;
      vec3 nextPos = pos + (dir+nextDir)*.5*stepLen;
      vec3 averagedDir = normalize((dir+nextDir)*.5);

      if((previousSide>0.0 && nextPos.y<=0.0) || (previousSide<0.0 && nextPos.y>=0.0)) {
        float mixAmount = previousSide / (previousSide-nextPos.y);
        vec3 hit = mix(pos,nextPos,clamp(mixAmount,0.0,1.0));
        float hr = length(hit.xz);
        if(hr>innerR && hr<outerR) {
          vec3 emission = diskEmission(hit,averagedDir,u_time,length(hit));
          float absorption = .58 * clamp(length(emission),0.0,1.0);
          accumulated += transmittance*emission;
          transmittance *= (1.0-absorption);
        }
      }
      pos=nextPos;
      dir=normalize(nextDir);
      previousSide=pos.y;
      if(r>31.0 && dot(pos,dir)>0.0) { escaped = true; break; }
    }

    vec3 color = accumulated;
    if(!swallowed) color += background(dir)*transmittance;

    // Gentle photographic bloom around the brightest radiance without fake
    // circular outlines; the lensing arc originates in the ray-traced disk.
    float luminosity = max(color.r,max(color.g,color.b));
    color += max(color-vec3(.64),vec3(0.0))*.14;
    color = vec3(1.0)-exp(-color*1.08);
    color = pow(color,vec3(.90));
    // Subtle lens vignette; deliberately no wireframes, equations or quantum grids.
    float vig = (1.0-smoothstep(.35,1.18,length(p/vec2(max(1.0,aspect*.55),1.0))));
    color *= mix(.57,1.0,vig);
    fragColor = vec4(color,1.0);
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
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);

  let visible = true;
  let stopped = false;
  let previousTime = 0;
  let raf = 0;
  const startTime = performance.now();
  const frameInterval = 1000/24;
  const maxWidth = 1100;
  const maxHeight = 780;
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
