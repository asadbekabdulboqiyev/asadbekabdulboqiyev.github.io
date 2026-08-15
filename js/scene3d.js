/* ============================================================
   TECHCORP 3D ENGINE — two scenes:
   A) fixed ambient world  (hero knot · about solids · contact)
   B) interactive 12-project 3D carousel (real objects)
   ============================================================ */
async function boot3D(){
  try{
    const THREE = await import('three');
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
    const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
    const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');
    const { OutputPass } = await import('three/addons/postprocessing/OutputPass.js');

    const PROJECTS = window.PORTFOLIO_DATA.projects;
    const MAT_COLORS = window.PORTFOLIO_DATA.matColors;

    const canvasA = document.getElementById('scene3d');
    const canvasB = document.getElementById('projects3d');
    const wrap = document.getElementById('projWrap');
    const labelBox = document.getElementById('plabels');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = innerWidth < 768;
    const ACCENT = 0x97c459;
    const fine = matchMedia('(pointer:fine)').matches;

    /* ================= SCENE A — ambient background ================= */
    const rendererA = new THREE.WebGLRenderer({ canvas: canvasA, antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
    rendererA.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
    rendererA.setSize(innerWidth, innerHeight);
    rendererA.toneMapping = THREE.ACESFilmicToneMapping;
    rendererA.toneMappingExposure = 1.15;

    const sceneA = new THREE.Scene();
    sceneA.background = new THREE.Color(0x070708);
    sceneA.fog = new THREE.FogExp2(0x070708, 0.026);

    const pmrem = new THREE.PMREMGenerator(rendererA);
    sceneA.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const cameraA = new THREE.PerspectiveCamera(44, innerWidth / innerHeight, 0.1, 120);
    cameraA.position.set(0, 0.2, 16);

    sceneA.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xfff2e0, 2.2); key.position.set(5, 7, 4);
    const fill = new THREE.DirectionalLight(0x9fb8ff, 0.7); fill.position.set(-6, -2, 3);
    const accL = new THREE.PointLight(ACCENT, 120, 45, 1.8); accL.position.set(6, -3, 8);
    const rimL = new THREE.PointLight(0x4a7dff, 70, 45, 1.8); rimL.position.set(-8, 4, -6);
    sceneA.add(key, fill, accL, rimL);

    const crystal = new THREE.MeshPhysicalMaterial({ color: 0xf2ede4, metalness: 0.1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, opacity: 0.5, envMapIntensity: 1.2, depthWrite: false });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.95, roughness: 0.35, envMapIntensity: 1.2 });
    const greenMetal = new THREE.MeshStandardMaterial({ color: ACCENT, metalness: 0.9, roughness: 0.28, envMapIntensity: 1.3 });

    /* hero torus knot */
    const hero = new THREE.Group();
    const heroMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xcfe8b0).lerp(new THREE.Color(ACCENT), 0.35),
      metalness: 0.85, roughness: 0.16, iridescence: 1.0, iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 520], clearcoat: 1.0, clearcoatRoughness: 0.12,
      envMapIntensity: 1.4, transparent: isMobile, opacity: isMobile ? 0.5 : 1
    });
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.34, 180, 26), heroMat);
    const shell = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.15, 0.34, 180, 26),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: isMobile ? 0.08 : 0.14, depthWrite: false })
    );
    shell.scale.setScalar(1.12);
    hero.add(knot, shell);
    const sats = [];
    const satGeo = new THREE.SphereGeometry(0.085, 16, 16);
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0xd9f0b8 }));
      hero.add(m);
      sats.push({ mesh: m, radius: 1.95, speed: 0.5 + i * 0.16, phase: i * 2.1 });
    }
    const P = isMobile ? { x: 0, y: 1.15, z: -3.2, s: 0.62 } : { x: 3.5, y: 0.5, z: 0, s: 1 };
    hero.position.set(P.x, P.y, P.z);
    hero.scale.setScalar(reduce ? P.s : 0.001);
    sceneA.add(hero);

    /* about cluster */
    const RX = isMobile ? 0.32 : 1, RY = isMobile ? 0.8 : 1;
    const cluster = [];
    function solid(geo, mat, x, y, z, sx, sy){
      const g = new THREE.Group();
      g.add(new THREE.Mesh(geo, mat));
      g.position.set(x * RX, y * RY, z);
      if (isMobile) g.scale.setScalar(0.7);
      sceneA.add(g);
      cluster.push({ g, sx, sy, baseY: y * RY, phase: Math.random() * Math.PI * 2 });
    }
    solid(new THREE.DodecahedronGeometry(1.0, 0), greenMetal, -3.6,  1.2, -16, 0.35, 0.42);
    solid(new THREE.IcosahedronGeometry(0.85, 0), crystal,      3.7, -0.8, -15, 0.5, -0.3);
    solid(new THREE.OctahedronGeometry(0.75, 0), darkMetal,     0.6,  1.9, -14, 0.6, 0.55);
    solid(new THREE.TorusGeometry(0.55, 0.09, 12, 42), greenMetal, -1.8, -1.3, -14.5, 0.9, 0.7);

    /* contact constellation */
    const contact = new THREE.Group();
    const tetraMat = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.55, depthWrite: false });
    const tetra = new THREE.Mesh(new THREE.TetrahedronGeometry(1.35, 0), tetraMat);
    const tetra2 = new THREE.Mesh(new THREE.TetrahedronGeometry(1.8, 0), new THREE.MeshBasicMaterial({ color: 0xf2ede4, wireframe: true, transparent: true, opacity: 0.16, depthWrite: false }));
    tetra2.rotation.set(0.7, 0.5, 0.2);
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 0), crystal);
    const halo = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.12, 64), new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
    halo.rotation.x = Math.PI / 2.2;
    contact.add(tetra, tetra2, orb, halo);
    contact.position.set(isMobile ? 0 : -3.4, isMobile ? -0.2 : 0.5, -46);
    if (isMobile) contact.scale.setScalar(0.7);
    sceneA.add(contact);

    /* stars */
    const starGeo = new THREE.BufferGeometry();
    const starN = isMobile ? 140 : 260;
    const pos = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 60;
      pos[i*3+1] = (Math.random() - 0.5) * 34;
      pos[i*3+2] = -2 - Math.random() * 52;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sceneA.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x8899aa, size: 0.035, transparent: true, opacity: 0.4, sizeAttenuation: true, depthWrite: false, fog: false })));

    const composerA = new EffectComposer(rendererA);
    composerA.addPass(new RenderPass(sceneA, cameraA));
    const bloomA = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), isMobile ? 0.25 : 0.55, 0.65, 0.2);
    composerA.addPass(bloomA);
    composerA.addPass(new OutputPass());

    /* ================= SCENE B — 12-project 3D carousel ================= */

    function buildShape(kind){
      switch (kind) {
        case 'cube':    return new THREE.BoxGeometry(1.05, 1.05, 1.05);
        case 'store':   return new THREE.BoxGeometry(1.3, 0.8, 0.7);
        case 'octa':    return new THREE.OctahedronGeometry(0.95, 0);
        case 'ring':    return new THREE.TorusGeometry(0.62, 0.24, 20, 48);
        case 'tetra':   return new THREE.TetrahedronGeometry(1.05, 0);
        case 'sphere':  return new THREE.SphereGeometry(0.85, 32, 32);
        case 'dode':    return new THREE.DodecahedronGeometry(0.9, 0);
        case 'ico':     return new THREE.IcosahedronGeometry(0.95, 0);
        case 'coin':    return new THREE.CylinderGeometry(0.62, 0.62, 0.42, 40);
        case 'knot':    return new THREE.TorusKnotGeometry(0.62, 0.2, 90, 14);
        case 'capsule': return new THREE.CapsuleGeometry(0.52, 0.7, 6, 16);
        case 'cone':    return new THREE.ConeGeometry(0.72, 1.25, 5);
      }
    }

    const rendererB = new THREE.WebGLRenderer({ canvas: canvasB, antialias: true, alpha: true });
    rendererB.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.6 : 2));
    const sceneB = new THREE.Scene();
    sceneB.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const cameraB = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
    cameraB.position.set(0, 0.6, 9.5);
    sceneB.add(new THREE.AmbientLight(0xffffff, 0.55));
    const keyB = new THREE.DirectionalLight(0xfff2e0, 2.0); keyB.position.set(4, 6, 5);
    const accB = new THREE.PointLight(ACCENT, 80, 30, 1.8); accB.position.set(0, 2, 4);
    const rimB = new THREE.PointLight(0x4a7dff, 50, 30, 1.8); rimB.position.set(-6, -2, -3);
    sceneB.add(keyB, accB, rimB);

    const RR = isMobile ? 2.8 : 4.6;
    const carousel = new THREE.Group();
    const pItems = [];
    const selRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.02, 10, 60),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 })
    );
    selRing.visible = false;
    sceneB.add(selRing);

    PROJECTS.forEach((p, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: MAT_COLORS[i % MAT_COLORS.length], metalness: 0.75, roughness: 0.28,
        envMapIntensity: 1.2, emissive: 0x000000
      });
      const mesh = new THREE.Mesh(buildShape(p.geo), mat);
      const wf = new THREE.Mesh(buildShape(p.geo), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1, depthWrite: false }));
      wf.scale.setScalar(1.1);
      mesh.add(wf);
      const a = (i / PROJECTS.length) * Math.PI * 2;
      mesh.position.set(Math.sin(a) * RR, 0, Math.cos(a) * RR);
      mesh.rotation.y = -a;
      mesh.userData.index = i;
      carousel.add(mesh);
      pItems.push(mesh);
    });
    sceneB.add(carousel);

    /* DOM labels over the 3D objects */
    const labels = [];
    PROJECTS.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'plabel';
      el.innerHTML = '<i>◆</i>' + p.name;
      el.addEventListener('click', () => { select(i, true); });
      el.addEventListener('mouseenter', () => { if (sel !== i) setHover(i, true); });
      el.addEventListener('mouseleave', () => { if (sel !== i) setHover(i, false); });
      labelBox.appendChild(el);
      labels.push(el);
    });

    /* ---------- interaction state (carousel) ---------- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let dragging = false, moved = false, vel = 0, lastX = 0, lastT = 0;
    let downX = 0, downY = 0, baseRot = 0, lastInteract = 0;
    let sel = 0, manual = false, hoverI = -1;
    let wrapVisible = true;
    const tmpV = new THREE.Vector3();
    const tmpV2 = new THREE.Vector3();

    function select(i, user){
      sel = i;
      manual = manual || !!user;
      if (user) lastInteract = performance.now();
      updateDetail();
      updateLabelStates();
    }
    function setHover(i, on){
      hoverI = on ? i : -1;
      const m = pItems[i];
      m.material.emissive.setHex(on ? ACCENT : 0x000000);
      m.material.emissiveIntensity = on ? 0.55 : 0;
    }
    function updateLabelStates(){
      labels.forEach((el, i) => el.classList.toggle('active', i === sel));
    }
    function updateDetail(){
      const p = PROJECTS[sel];
      document.getElementById('dIndex').textContent = String(sel + 1).padStart(3, '0');
      document.getElementById('dName').textContent = p.name;
      document.getElementById('dDesc').textContent = p.desc;
      document.getElementById('dTags').innerHTML = p.tags.map(t => '<span class="ptag main">' + t + '</span>').join('');
      document.getElementById('dLink').href = p.url;
    }
    function spinOnce(){ vel = 3.5; lastInteract = performance.now() - 500; } /* kick a spin */

    /* canvas interaction */
    function px(e){
      if (e.touches && e.touches.length) return e.touches[0];
      if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0];
      return e;
    }
    function onDown(e){ dragging = true; moved = false; const t = px(e); downX = t.clientX; downY = t.clientY; lastX = t.clientX; lastT = performance.now(); baseRot = carousel.rotation.y; vel = 0; }
    function onMove(e){
      if (!dragging) return;
      const t = px(e);
      const dx = t.clientX - downX;
      carousel.rotation.y = baseRot + dx * 0.006;
      const now = performance.now();
      const dtms = Math.max(1, now - lastT);
      vel = ((t.clientX - lastX) / dtms) * 14;
      lastX = t.clientX; lastT = now;
      if (Math.abs(t.clientX - downX) + Math.abs(t.clientY - downY) > 6) moved = true;
    }
    function onUp(e){
      if (!dragging) return;
      dragging = false;
      if (!moved) { pick(e); } else { lastInteract = performance.now(); }
    }
    function pick(e){
      const t = px(e);
      const r = canvasB.getBoundingClientRect();
      ndc.x = ((t.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((t.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(ndc, cameraB);
      const hits = raycaster.intersectObjects(pItems, false);
      if (hits.length) select(hits[0].object.userData.index, true);
    }
    canvasB.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    canvasB.addEventListener('touchstart', e => { onDown(e); }, { passive: true });
    canvasB.addEventListener('touchmove', e => { onMove(e); e.preventDefault(); }, { passive: false });
    canvasB.addEventListener('touchend', e => { onUp(e); }, { passive: true });

    /* prev / next / spin buttons */
    document.getElementById('dPrev').addEventListener('click', () => select((sel + PROJECTS.length - 1) % PROJECTS.length, true));
    document.getElementById('dNext').addEventListener('click', () => select((sel + 1) % PROJECTS.length, true));
    document.getElementById('dSpin').addEventListener('click', () => { spinOnce(); });

    /* pause carousel when off-screen */
    new IntersectionObserver(es => {
      es.forEach(en => { wrapVisible = en.isIntersecting; });
    }, { threshold: 0.05 }).observe(wrap);

    /* ---------- shared loop ---------- */
    const clock = new THREE.Clock();
    let running = true;
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) clock.getDelta(); });

    let mx = 0, my = 0, scrollT = 0, scrollVel = 0, lastSy = 0, camAZ = 16, autoSelT = 0;

    if (!reduce && fine) {
      addEventListener('pointermove', e => {
        mx = (e.clientX / innerWidth) * 2 - 1;
        my = (e.clientY / innerHeight) * 2 - 1;
      }, { passive: true });
    }

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = t => t * t * (3 - 2 * t);

    /* label position math */
    function placeLabels(){
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 10) return;
      for (let i = 0; i < pItems.length; i++) {
        const el = labels[i];
        pItems[i].getWorldPosition(tmpV);
        tmpV.y += 1.7;
        const nearSide = tmpV.z > 0;
        tmpV.project(cameraB);
        if (tmpV.z > 1 || tmpV.x < -1 || tmpV.x > 1 || tmpV.y < -1 || tmpV.y > 1) {
          el.style.opacity = '0';
          continue;
        }
        const x = (tmpV.x * 0.5 + 0.5) * rect.width;
        const y = (-tmpV.y * 0.5 + 0.5) * rect.height;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
        el.style.opacity = nearSide ? '1' : '0.3';
        el.style.zIndex = nearSide ? '2' : '1';
      }
    }

    function resize(){
      const w = innerWidth, h = innerHeight;
      cameraA.aspect = w / h; cameraA.updateProjectionMatrix();
      rendererA.setSize(w, h);
      composerA.setSize(w, h);
      bloomA.setSize(w, h);
      const rw = wrap.clientWidth || 600, rh = wrap.clientHeight || 480;
      cameraB.aspect = rw / rh; cameraB.updateProjectionMatrix();
      rendererB.setSize(rw, rh, false);
    }
    addEventListener('resize', resize);
    resize();
    updateDetail();
    updateLabelStates();

    function animate(){
      requestAnimationFrame(animate);
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      /* --- scene A camera (scroll journey) --- */
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const sy = window.scrollY;
      scrollVel = lerp(scrollVel, Math.abs(sy - lastSy) * 0.08, 0.06);
      lastSy = sy;
      scrollT = reduce ? 0 : lerp(scrollT, clamp(sy / maxScroll, 0, 1), 0.07);
      const targetZ = reduce ? 9 : 9 - 55 * smooth(scrollT);
      camAZ = lerp(camAZ, targetZ, reduce ? 1 : 0.05);
      cameraA.fov = lerp(cameraA.fov, 44 + clamp(scrollVel, 0, 4) * 6, 0.06);
      cameraA.updateProjectionMatrix();
      cameraA.position.x = lerp(cameraA.position.x, mx * 1.5, reduce ? 0 : 0.04);
      cameraA.position.y = lerp(cameraA.position.y, 0.2 + my * 0.9, reduce ? 0 : 0.04);
      cameraA.position.z = camAZ;
      cameraA.lookAt(mx * 0.7, my * 0.4, camAZ - 8);

      const intro = clamp((16 - camAZ) / 7, 0, 1);
      const ts = P.s * (0.2 + 0.8 * smooth(intro));
      hero.scale.x = lerp(hero.scale.x, ts, 0.08);
      hero.scale.y = hero.scale.x; hero.scale.z = hero.scale.x;

      const spin = 1 + clamp(scrollVel, 0, 3) * 0.9;
      knot.rotation.y += 0.0032 * dt * 60 * spin;
      knot.rotation.x += 0.0011 * dt * 60 * spin;
      shell.rotation.y -= 0.0016 * dt * 60 * spin;
      shell.rotation.z += 0.0008 * dt * 60;
      for (const s of sats) {
        const a = t * s.speed + s.phase;
        s.mesh.position.set(Math.cos(a) * s.radius, Math.sin(a) * s.radius * 0.62, Math.sin(a * 0.7) * 0.5);
      }
      for (const c of cluster) {
        c.g.rotation.x += c.sx * 0.004 * dt * 60;
        c.g.rotation.y += c.sy * 0.004 * dt * 60;
        c.g.position.y = c.baseY + Math.sin(t * 0.7 + c.phase) * 0.18;
      }
      contact.rotation.y += 0.0035 * dt * 60;
      contact.rotation.x = Math.sin(t * 0.4) * 0.25;
      contact.scale.setScalar((isMobile ? 0.7 : 1) * (1 + Math.sin(t * 1.7) * 0.06));
      const oa = t * 1.1;
      orb.position.set(Math.cos(oa) * 2.1, Math.sin(oa * 1.4) * 1.1, Math.sin(oa) * 2.1);

      composerA.render();

      /* --- scene B carousel --- */
      if (wrapVisible && !reduce) {
        const now = performance.now();
        if (!dragging) {
          if (now - lastInteract > 250) { carousel.rotation.y += vel * dt; vel *= 0.93; }
          if (now - lastInteract > 4500 && !manual) carousel.rotation.y += 0.0032 * dt * 60;
        }
        /* auto-cycle selection until first manual pick */
        if (!manual && wrapVisible) {
          autoSelT += dt;
          if (autoSelT > 3.2) { autoSelT = 0; select((sel + 1) % PROJECTS.length, false); }
        }
        /* selected ring highlight */
        const selMesh = pItems[sel];
        selRing.visible = true;
        selMesh.getWorldPosition(tmpV);
        selRing.position.copy(tmpV);
        selRing.lookAt(cameraB.position);
        selRing.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
        /* pulse selected / idle others */
        for (let i = 0; i < pItems.length; i++) {
          const m = pItems[i];
          const base = isMobile ? 0.85 : 1;
          const sc = (i === sel ? base * (1.14 + Math.sin(t * 3) * 0.05) : (i === hoverI ? base * 1.1 : base));
          m.scale.setScalar(sc);
        }
        rendererB.render(sceneB, cameraB);
      }
      placeLabels();
    }

    if (reduce) {
      hero.scale.setScalar(P.s);
      cameraA.position.set(0, 0.2, 9); cameraA.lookAt(0, 0, 1);
      composerA.render();
      if (wrapVisible) rendererB.render(sceneB, cameraB);
      placeLabels();
    } else {
      animate();
    }

    window.__3dReady = true;
    document.body.classList.add('3d-on');
    document.body.classList.remove('no-3d');

  } catch (err) {
    document.body.classList.add('no-3d');
    if (window.console) console.warn('3D scene unavailable:', err);
  }
}

boot3D();
