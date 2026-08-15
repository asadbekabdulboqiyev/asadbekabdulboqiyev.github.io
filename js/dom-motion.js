/* ============================================================
   DOM MOTION — cursor, tilt, magnetic, parallax, reveal,
   marquee, scrollspy, count-up
   ============================================================ */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;

  /* custom cursor */
  if (fine && !reduce) {
    const cur = document.getElementById('cur'), ring = document.getElementById('ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = (mx - 3) + 'px'; cur.style.top = (my - 3) + 'px'; }, { passive: true });
    (function ringAnim(){
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = (rx - 14) + 'px'; ring.style.top = (ry - 14) + 'px';
      requestAnimationFrame(ringAnim);
    })();
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '44px'; ring.style.height = '44px'; ring.style.opacity = '0.6'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '28px'; ring.style.height = '28px'; ring.style.opacity = '1'; });
    });
  }

  /* scroll progress */
  const prog = document.getElementById('progress');
  (function tick(){
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    if (!reduce) requestAnimationFrame(tick);
  })();

  /* reveal */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* scrollspy */
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'projects', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) secObs.observe(el); });

  /* magnetic buttons + card glow */
  if (fine && !reduce) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.18;
        const dy = (e.clientY - r.top - r.height / 2) * 0.22;
        btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* count-up stats */
  if (!reduce) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        cObs.unobserve(e.target);
        const el = e.target, target = parseFloat(el.dataset.target);
        const t0 = performance.now();
        (function step(now){
          const p = Math.min(1, (now - t0) / 1300);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.count').forEach(el => cObs.observe(el));
  }

  /* skill bars fill on reveal */
  if (!reduce) {
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        sObs.unobserve(e.target);
        e.target.querySelectorAll('.skill-bar i').forEach(b => { b.style.width = b.dataset.w || b.style.width; });
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skills-list').forEach(el => sObs.observe(el));
  }

  /* hero parallax */
  if (!reduce) {
    const els = Array.from(document.querySelectorAll('.parallax')).map(el => ({ el, speed: parseFloat(el.dataset.speed || 0) }));
    els.forEach(({ el }) => { el.style.willChange = 'transform'; });
    (function parallax(){
      const sy = window.scrollY;
      for (const { el, speed } of els) el.style.transform = 'translateY(' + (sy * speed) + 'px)';
      requestAnimationFrame(parallax);
    })();
  }
})();
