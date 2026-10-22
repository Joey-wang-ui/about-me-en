/* Whole-letter soft-body deformation. Textures and contours share one mesh. */
(() => {
  'use strict';
  const EXTENT = 1.55;
  const vertexSource = `
    attribute vec2 a_position;
    uniform vec4 u_crop;
    uniform vec2 u_focus;
    uniform vec2 u_force;
    uniform float u_press;
    uniform float u_wobble;
    uniform float u_phase;
    varying vec2 v_uv;
    void main() {
      vec2 p = a_position;
      v_uv = u_crop.xy + (p * .5 + .5) * u_crop.zw;
      float soft = u_press;
      vec2 q = p * vec2(1.0 + soft * .06, 1.0 - soft * .055);
      // Broad bends change the whole silhouette, rather than making a dent.
      q.x += sin(p.y * 2.15 + u_focus.y * .45) * soft * .045;
      q.y += sin(p.x * 2.3 + u_focus.x * .45) * soft * .025;
      float top = (p.y + 1.0) * .5;
      float side = (p.x + 1.0) * .5;
      q.x += u_force.x * (.32 + .68 * top) + u_force.y * p.y * p.x * .08;
      q.y += u_force.y * (.35 + .65 * side) + u_force.x * p.x * p.y * .06;
      float twist = (u_force.x - u_force.y * .5) * p.y * .09;
      q = mat2(cos(twist), -sin(twist), sin(twist), cos(twist)) * q;
      vec2 wave = vec2(sin(p.y * 3.8 + u_phase), sin(p.x * 3.4 - u_phase * .8));
      q += wave * u_wobble * (.65 + .35 * (1.0 - p.x * p.x));
      gl_Position = vec4(q / ${EXTENT.toFixed(2)}, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_uv;
    void main() { gl_FragColor = texture2D(u_image, v_uv); }
  `;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const spring = () => ({ value: 0, velocity: 0, target: 0 });
  function step(s, dt) {
    s.velocity += ((s.target - s.value) * 100 - s.velocity * 18) * dt;
    s.value += s.velocity * dt;
    if (Math.abs(s.target - s.value) < .0001 && Math.abs(s.velocity) < .001) {
      s.value = s.target;
      s.velocity = 0;
    }
    return s.value !== s.target || s.velocity !== 0;
  }
  function mesh() {
    const points = [];
    const nx = 24, ny = 32;
    for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
      const l = x / nx * 2 - 1, r = (x + 1) / nx * 2 - 1;
      const b = y / ny * 2 - 1, t = (y + 1) / ny * 2 - 1;
      points.push(l, b, r, b, l, t, l, t, r, b, r, t);
    }
    return new Float32Array(points);
  }
  const geometry = mesh();
  function createRenderer(state, image, crop) {
    const canvas = document.createElement('canvas');
    canvas.className = 'jelly-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) return null;
    function shader(type, source) {
      const result = gl.createShader(type);
      gl.shaderSource(result, source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error('Jelly shader unavailable');
      return result;
    }
    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, shader(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Jelly renderer unavailable');
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Jelly texture unavailable');
      gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);
      gl.uniform4fv(gl.getUniformLocation(program, 'u_crop'), crop);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } catch {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return null;
    }
    const uniforms = Object.fromEntries(['focus', 'force', 'press', 'wobble', 'phase'].map(name => [name, gl.getUniformLocation(program, `u_${name}`)]));
    function draw(now = performance.now()) {
      if (gl.isContextLost()) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.focus, state.aimX.value, state.aimY.value);
      gl.uniform2f(uniforms.force, state.x.value, state.y.value);
      gl.uniform1f(uniforms.press, clamp(state.press.value, -.05, 1.12));
      gl.uniform1f(uniforms.wobble, clamp(state.press.velocity * .0025 + (state.x.velocity - state.y.velocity) * .002, -.012, .012));
      gl.uniform1f(uniforms.phase, now / 1000 * 3.5);
      gl.drawArrays(gl.TRIANGLES, 0, geometry.length / 2);
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.round(state.art.offsetWidth * EXTENT * dpr));
      canvas.height = Math.max(1, Math.round(state.art.offsetHeight * EXTENT * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    }
    state.art.append(canvas);
    resize();
    state.art.classList.add('is-mesh-ready');
    state.glyph.classList.add('has-jelly-mesh');
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      state.art.classList.remove('is-mesh-ready');
      state.glyph.classList.remove('has-jelly-mesh');
      state.renderer = null;
    });
    if (typeof ResizeObserver === 'function') new ResizeObserver(resize).observe(state.art);
    else addEventListener('resize', resize);
    return { draw };
  }
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }
  window.JoeyJelly = {
    mount(links, disabled) {
      const states = [];
      let frame = 0, previous = 0;
      function requestFrame() {
        if (!frame && !disabled()) { previous = performance.now(); frame = requestAnimationFrame(tick); }
      }
      function paint(state, now) {
        if (state.renderer) {
          state.renderer.draw(now);
        } else {
          // The fallback still stretches and bends the entire letter.
          state.glyph.style.setProperty('--touch-scale-x', (1 + state.press.value * .06).toFixed(4));
          state.glyph.style.setProperty('--touch-scale-y', (1 - state.press.value * .055).toFixed(4));
          state.glyph.style.setProperty('--jelly-skew', `${(state.x.value * 10).toFixed(2)}deg`);
          state.glyph.style.setProperty('--jelly-rise', `${(-state.y.value * 12).toFixed(2)}px`);
        }
      }
      function tick(now) {
        frame = 0;
        if (disabled()) { reset(); return; }
        const dt = clamp((now - previous) / 1000, .001, .032);
        previous = now;
        let moving = false;
        states.forEach(state => {
          let active = false;
          for (let i = 0; i < 2; i++) {
            active = step(state.press, dt / 2) || active;
            active = step(state.x, dt / 2) || active;
            active = step(state.y, dt / 2) || active;
            active = step(state.aimX, dt / 2) || active;
            active = step(state.aimY, dt / 2) || active;
          }
          if (active || state.dirty) paint(state, now);
          state.dirty = false;
          if (!active && !state.hover && !state.down) state.link.classList.remove('is-touching');
          moving = active || moving;
        });
        if (moving) frame = requestAnimationFrame(tick);
      }
      function reset() {
        cancelAnimationFrame(frame);
        frame = 0;
        states.forEach(state => {
          state.hover = state.down = state.dragged = false;
          [state.press, state.x, state.y, state.aimX, state.aimY].forEach(s => { s.value = s.velocity = s.target = 0; });
          state.link.classList.remove('is-touching', 'is-pulling');
          ['--touch-scale-x', '--touch-scale-y', '--jelly-skew', '--jelly-rise'].forEach(name => state.glyph.style.removeProperty(name));
          if (state.pointerId != null && state.link.hasPointerCapture(state.pointerId)) state.link.releasePointerCapture(state.pointerId);
          state.pointerId = null;
          state.renderer?.draw();
        });
      }
      [...links].forEach((link, index) => {
        const art = link.querySelector('.jelly-art'), glyph = link.querySelector('.joey-glyph');
        const state = { link, art, glyph, index, press: spring(), x: spring(), y: spring(), aimX: spring(), aimY: spring(), focusX: 0, focusY: 0, hover: false, down: false, dragged: false, suppressUntil: 0, dirty: false, renderer: null, pointerId: null };
        states.push(state);
        link.draggable = false;
        function point(event) {
          const bounds = art.getBoundingClientRect();
          state.focusX = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
          state.focusY = clamp(1 - (event.clientY - bounds.top) / bounds.height * 2, -1, 1);
          // Smooth the contact point too, so broad bends never jump with the pointer.
          state.aimX.target = state.focusX;
          state.aimY.target = state.focusY;
          state.press.target = state.down ? 1.08 : 1;
          state.x.target = state.focusX * .09;
          state.y.target = state.focusY * .075;
          if (state.down) {
            const dx = event.clientX - state.startX, dy = event.clientY - state.startY;
            state.dragged ||= Math.hypot(dx, dy) > 7;
            state.x.target += clamp(dx / bounds.width * .5, -.22, .22);
            state.y.target -= clamp(dy / bounds.height * .5, -.2, .2);
            state.x.target = clamp(state.x.target, -.28, .28);
            state.y.target = clamp(state.y.target, -.25, .25);
          }
          state.dirty = true;
          link.classList.add('is-touching');
          requestFrame();
        }
        glyph.addEventListener('pointerenter', event => {
          if (disabled() || event.pointerType === 'touch') return;
          state.hover = true;
          point(event);
        });
        glyph.addEventListener('pointermove', event => {
          if (!state.down && state.hover && !disabled() && event.pointerType !== 'touch') point(event);
        });
        glyph.addEventListener('pointerleave', () => {
          state.hover = false;
          if (state.down) return;
          state.press.target = state.x.target = state.y.target = 0;
          requestFrame();
        });
        glyph.addEventListener('pointerdown', event => {
          if (disabled() || event.pointerType === 'touch' || event.button !== 0) return;
          state.down = true;
          state.dragged = false;
          state.startX = event.clientX;
          state.startY = event.clientY;
          state.pointerId = event.pointerId;
          link.setPointerCapture(event.pointerId);
          link.classList.add('is-pulling');
          point(event);
        });
        link.addEventListener('pointermove', event => { if (state.down && !disabled()) point(event); });
        function release(event) {
          if (!state.down) return;
          const cancelled = event.type !== 'pointerup';
          if (state.dragged || cancelled) state.suppressUntil = performance.now() + 450;
          state.down = false;
          link.classList.remove('is-pulling');
          const bounds = glyph.getBoundingClientRect();
          state.hover = !cancelled && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
          state.press.target = state.hover ? 1 : 0;
          state.x.target = state.hover ? state.focusX * .09 : 0;
          state.y.target = state.hover ? state.focusY * .075 : 0;
          const pointerId = state.pointerId;
          state.pointerId = null;
          if (pointerId != null && link.hasPointerCapture(pointerId)) link.releasePointerCapture(pointerId);
          requestFrame();
        }
        link.addEventListener('pointerup', release);
        link.addEventListener('pointercancel', release);
        link.addEventListener('lostpointercapture', release);
        link.addEventListener('dragstart', event => event.preventDefault());
        link.addEventListener('click', event => {
          if (event.detail > 0 && performance.now() < state.suppressUntil) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        }, true);
      });
      Promise.all([loadImage('assets/jelly-j-uppercase.png'), loadImage('assets/jelly-letters.png')]).then(([capital, sheet]) => {
        states.forEach(state => {
          state.renderer = createRenderer(state, state.index === 0 ? capital : sheet, state.index === 0 ? [0, 0, 1, 1] : [state.index / 4, 0, .25, 1]);
          state.dirty = true;
          if (state.renderer) state.renderer.draw();
        });
        requestFrame();
      }).catch(() => { /* The original artwork and whole-letter CSS fallback remain usable. */ });
      return { reset };
    },
  };
})();
