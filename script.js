/* script.js — Hotspots con auto-fit + Botones flotantes parametrizables
   Requiere en el HTML los ids: #board, #base, #hotspots, #actions, #coords
   Y que data.js defina:
     window.HOTSPOTS = [{x,y,n,title,text, link?, linkText?, align?, vpos?}, ...]
     window.BUTTONS  = [{x,y,label, href, target?, replace?, download?, confirm?, variant?, size?}, ...]
*/
(function () {
  const img     = document.getElementById('base');      // IMAGEN (límites reales)
  const hsLayer = document.getElementById('hotspots');  // capa hotspots
  const acLayer = document.getElementById('actions');   // capa botones
  const coords  = document.getElementById('coords');    // visor coordenadas
  let coordMode = false;

  // ---------- Render HOTSPOTS ----------
  function renderHotspots() {
    if (!Array.isArray(window.HOTSPOTS)) { hsLayer.innerHTML = ''; return; }
    hsLayer.innerHTML = '';

    window.HOTSPOTS.forEach(h => {
      const btn = document.createElement('button');
      btn.className = 'hotspot';
      btn.type = 'button';
      btn.style.left = (h.x || 0) + '%';
      btn.style.top  = (h.y || 0) + '%';
      btn.setAttribute('aria-label', h.title || 'Detalle');

      const n     = (h.n ?? '') + '';
      const title = (h.title || 'Detalle').replace(/</g, '&lt;');
      const text  = (h.text  || '').replace(/</g, '&lt;');

      const linkHTML = h.link
        ? `<p class="cta"><a class="tip-link" href="${h.link}" target="_blank" rel="noopener noreferrer">${h.linkText || 'Ver más'}</a></p>`
        : '';

      btn.innerHTML = `
        <span class="num">${n}</span>
        <span class="tip" role="tooltip">
          <h3>${title}</h3>
          <p>${text}</p>
          ${linkHTML}
        </span>
      `;

      // Respeta orientaciones fijas si las definiste en data.js
      if (h.align === 'left' || h.align === 'right') btn.dataset.align = h.align;
      if (h.vpos === 'top' || h.vpos === 'bottom')   btn.dataset.vpos  = h.vpos;

      // Ajuste automático al entrar con mouse/teclado
      btn.addEventListener('pointerenter', () => fitTooltip(btn));
      btn.addEventListener('focus',        () => fitTooltip(btn));

      hsLayer.appendChild(btn);
    });
  }

  // ---------- Render BOTONES ----------
  function renderButtons() {
    if (!Array.isArray(window.BUTTONS)) { acLayer.innerHTML = ''; return; }
    acLayer.innerHTML = '';

    window.BUTTONS.forEach(b => {
      // Usamos <a> para permitir target/_blank y download nativos
      const a = document.createElement('a');
      a.className = 'action-btn';
      if (b.variant) a.classList.add(b.variant);    // 'secondary', 'ghost'
      if (b.size)    a.classList.add(b.size);       // 'sm', 'lg'

      a.style.left = (b.x || 0) + '%';
      a.style.top  = (b.y || 0) + '%';

      a.textContent = b.label || 'Abrir';
      a.href = b.href || '#';

      // target: 'blank' o 'self' (default self)
      const target = (b.target || 'self').toLowerCase();
      if (target === 'blank') {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      } else {
        a.target = '_self';
      }

      // download
      if (b.download) {
        a.setAttribute('download', typeof b.download === 'string' ? b.download : '');
      }

      // replace (reemplazar la URL actual en el historial)
      if (b.replace) {
        a.addEventListener('click', (e) => {
          // si hay confirmación, úsala
          if (b.confirm) {
            const ok = window.confirm(b.confirm);
            if (!ok) { e.preventDefault(); return; }
          }
          // misma ventana, reemplazando el historial
          e.preventDefault();
          try { window.location.replace(b.href); }
          catch { window.location.href = b.href; }
        });
      } else if (b.confirm) {
        a.addEventListener('click', (e) => {
          const ok = window.confirm(b.confirm);
          if (!ok) e.preventDefault();
        });
      }

      acLayer.appendChild(a);
    });
  }

  // ---------- Auto-ajuste de tooltips (no salirse de la imagen) ----------
  function setOrientation(h, orient) {
    // orient = 'top' (default), 'bottom', 'left', 'right'
    h.removeAttribute('data-align');
    h.removeAttribute('data-vpos');
    if (orient === 'left' || orient === 'right') {
      h.dataset.align = orient;
    } else if (orient === 'bottom') {
      h.dataset.vpos = 'bottom';
    } else if (orient === 'top') {
      h.dataset.vpos = 'top';
    }
  }

  function fits(rect, bounds, pad) {
    return rect.left   >= bounds.left + pad &&
           rect.right  <= bounds.right - pad &&
           rect.top    >= bounds.top  + pad &&
           rect.bottom <= bounds.bottom - pad;
  }

  function fitTooltip(hotspot) {
    const tip = hotspot.querySelector('.tip');
    if (!tip) return;

    const bounds = img.getBoundingClientRect(); // límites reales
    const pad = 6;
    const ORDER = ['right', 'left', 'bottom', 'top'];

    for (const o of ORDER) {
      setOrientation(hotspot, o);
      void tip.offsetWidth; // reflow para medir
      const r = tip.getBoundingClientRect();
      if (fits(r, bounds, pad)) return;
    }
    setOrientation(hotspot, 'top'); // fallback
  }

  // ---------- Modo coordenadas (tecla E) ----------
  function toggleCoordMode() {
    coordMode = !coordMode;
    coords.hidden = !coordMode;
    if (coordMode) coords.textContent = 'Modo coordenadas: clic copia { x:%, y:% }';
  }

  function onMove(e) {
    if (!coordMode) return;
    const r = img.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    coords.textContent = `x:${x.toFixed(2)}%  y:${y.toFixed(2)}%`;
  }

  function onClick(e) {
    if (!coordMode) return;
    const r = img.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const snippet = `{ x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, n: 0, title: "Título", text: "Descripción" },`;
    try { navigator.clipboard.writeText(snippet); } catch {}
    coords.textContent = `Copiado: ${snippet}`;
  }

  // ---------- Inicialización ----------
  window.addEventListener('load', () => {
    renderHotspots();
    renderButtons();

    const adjustAll = () =>
      hsLayer.querySelectorAll('.hotspot').forEach(h => fitTooltip(h));

    if (img.complete) adjustAll();
    else img.addEventListener('load', adjustAll);

    setTimeout(adjustAll, 120); // por si cambian fuentes/layout
  });

  window.addEventListener('resize', () => {
    hsLayer.querySelectorAll('.hotspot').forEach(h => fitTooltip(h));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') toggleCoordMode();
  });
  img.addEventListener('mousemove', onMove);
  img.addEventListener('click', onClick);

  
})();
