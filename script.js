(() => {
'use strict';

/* ============================================================
   UTILIDADES
   ============================================================ */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));

const BOOKING_URL = 'https://app.barbercode.com.br/client/lucasmarcolino77-at-icloudcom';
const EASE = 'cubic-bezier(.2,.7,.2,1)';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Placeholder embutido (sem depender de serviço externo) */
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#181614"/>
   <g fill="none" stroke="#c9a24d" stroke-width="3" opacity=".8" transform="translate(150 190)">
   <rect x="0" y="10" width="100" height="70" rx="8"/><circle cx="50" cy="45" r="16"/><path d="M30 10l6-10h28l6 10"/></g>
   <text x="200" y="330" fill="#a39c8c" font-family="sans-serif" font-size="18" text-anchor="middle">Foto em breve</text></svg>`);

/* Entrada animada quando o elemento aparece na tela (Web Animations + IntersectionObserver) */
const revealer = (() => {
  if (reduced || !('IntersectionObserver' in window)) return { observe() {} };
  const io = new IntersectionObserver((entries, obs) => {
    entries.filter(e => e.isIntersecting).forEach((e, i) => {
      obs.unobserve(e.target);
      e.target.animate(
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
        { duration: 520, delay: i * 80, easing: EASE, fill: 'backwards' });
      e.target.style.opacity = '';
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  return { observe(els) { els.forEach(el => { el.style.opacity = '0'; io.observe(el); }); } };
})();

/* ============================================================
   BARBEIROS — edite aqui nomes, fotos e textos (fonte única)
   ============================================================ */
const barbeiros = [
  {
    id: 'lucas', nome: 'Lucas', inicial: 'L',
    foto: '', // ex.: 'img/lucas.jpeg' — sem foto, mostra a inicial
    cargo: 'Fundador & Especialista',
    publico: 'Masculino e Feminino', atende: ['masculino', 'feminino'],
    especialidade: 'Cortes Masculinos & Femininos',
    descricao: 'Fundador da Eu Barbeiro Luk. Especialista em cortes femininos, masculinos e transformações completas de estilo. Une técnicas avançadas de tesoura para destacar a identidade única de cada cliente.',
    trabalhoFoto: 'img/lucas-corte-feminino.jpg',
    trabalhoFotoTitulo: 'Foto do Corte Feminino',
    trabalhoFotoLegenda: 'Corte e estilização com textura e caimento natural.',
    trabalhoVideo: 'img/corte_lucas.mp4',
    trabalhoVideoTitulo: 'Depilação com Cera',
    trabalhoVideoLegenda: 'Processo de depilação com cera, tendência da barbearia.'
  },
  {
    id: 'welliton', nome: 'Welliton', inicial: 'W',
    foto: 'img/welliton.jpeg',
    cargo: 'Barbeiro',
    publico: 'Masculino', atende: ['masculino'],
    especialidade: 'Cortes Modernos & Barba',
    descricao: 'Especialista em degradês de alta precisão (fades), cortes masculinos modernos e modelagem de barba. Domina técnicas de alinhamento com navalha para um visual marcante e impecável.',
    trabalhoFoto: 'img/corte_welliton.jpeg',
    trabalhoFotoTitulo: 'Americano',
    trabalhoFotoLegenda: 'Degradê suave com barba esculpida e alinhada.',
    trabalhoVideo: 'img/corte_welliton.mp4',
    trabalhoVideoTitulo: 'Vídeo de Corte Moderno',
    trabalhoVideoLegenda: 'Execução do mullet e tesoura.'
  },
  {
    id: 'davi', nome: 'Davi', inicial: 'D',
    foto: 'img/davi.jpeg',
    cargo: 'Barbeiro',
    publico: 'Masculino', atende: ['masculino'],
    especialidade: 'Freestyle & Tendências',
    descricao: 'Especialista em arte capilar, riscas personalizadas, cortes freestyle e estilos urbanos de alta tendência. Focado em criar desenhos exclusivos à mão livre e acabamentos criativos.',
    trabalhoFoto: 'img/davi-freestyle.jpg',
    trabalhoFotoTitulo: 'Foto Arte Freestyle',
    trabalhoFotoLegenda: 'Design exclusivo e riscas personalizadas.',
    trabalhoVideo: 'video-davi-corte.mp4',
    trabalhoVideoTitulo: 'Vídeo de Freestyle',
    trabalhoVideoLegenda: 'Criação de desenho e textura em tempo real.'
  },
  {
    id: 'gabriel', nome: 'Gabriel', inicial: 'G',
    foto: 'img/gabriel.jpeg',
    cargo: 'Barbeiro',
    publico: 'Masculino', atende: ['masculino'],
    especialidade: 'Degradê e Corte Social',
    descricao: 'Transição suave de alta precisão com sombreamento perfeito, contornos definidos e acabamento impecável.',
    trabalhoFoto: 'img/davi-freestyle.jpg',
    trabalhoFotoTitulo: 'Foto Arte Freestyle',
    trabalhoFotoLegenda: 'Design exclusivo e riscas personalizadas.',
    trabalhoVideo: 'img/degrade.mp4',
    trabalhoVideoTitulo: 'Vídeo de Freestyle',
    trabalhoVideoLegenda: 'Criação de desenho e textura em tempo real.'
  }
];

const avatar = b => b.foto
  ? `<img src="${esc(b.foto)}" alt="${esc(b.nome)}" loading="lazy" decoding="async" data-initial="${esc(b.inicial)}">`
  : esc(b.inicial);

const barbersRow = $('#barbersRow');
if (barbersRow) {
  barbersRow.innerHTML = barbeiros.map((b, i) => `
    <div class="col-12 col-sm-6 col-lg-3">
      <article class="barber-card d-flex flex-column justify-content-between h-100">
        <div>
          <div class="barber-avatar">${avatar(b)}</div>
          <h3>${esc(b.nome)}</h3>
          <div class="role">${esc(b.cargo)}</div>
          <div class="barber-tag">${esc(b.especialidade)}</div>
        </div>
        <button type="button" class="btn-outline-gold btn-barber-details mt-3" data-barber="${i}"
                aria-haspopup="dialog" aria-label="Ver perfil e trabalhos de ${esc(b.nome)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Ver Perfil &amp; Trabalhos
        </button>
      </article>
    </div>`).join('');
  revealer.observe($$('#barbersRow > div'));

  barbersRow.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.dataset.initial) img.parentElement.textContent = img.dataset.initial;
  }, true);
}

/* ============================================================
   MODAL DO BARBEIRO
   ============================================================ */
const modalEl = $('#barberModal');
const modalBody = $('#barberModalBody');
const modalTitle = $('#barberModalLabel');
let modal = null, current = -1, lastTrigger = null;

const ICON_IMG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
const ICON_VID = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>';

const barberView = (b, i) => {
  const prev = barbeiros[(i - 1 + barbeiros.length) % barbeiros.length];
  const next = barbeiros[(i + 1) % barbeiros.length];
  return `
    <div class="row g-3 align-items-center mb-4 pb-3 barber-modal-head">
      <div class="col-auto"><div class="barber-avatar barber-avatar--lg">${avatar(b)}</div></div>
      <div class="col">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
          <h3 class="m-0">${esc(b.nome)}</h3>
          <span class="barber-modal-badge">${esc(b.publico)}</span>
        </div>
        <div class="barber-modal-role">${esc(b.cargo)} · ${esc(b.especialidade)}</div>
        <p class="barber-modal-desc m-0">${esc(b.descricao)}</p>
      </div>
    </div>
    <div class="row g-3">
      <div class="col-md-6">
        <figure class="barber-media-card m-0">
          <h6>${ICON_IMG} ${esc(b.trabalhoFotoTitulo)}</h6>
          <img src="${esc(b.trabalhoFoto)}" alt="${esc(b.trabalhoFotoLegenda)}" loading="lazy" decoding="async">
          <figcaption class="media-caption">${esc(b.trabalhoFotoLegenda)}</figcaption>
        </figure>
      </div>
      <div class="col-md-6">
        <figure class="barber-media-card m-0">
          <h6>${ICON_VID} ${esc(b.trabalhoVideoTitulo)}</h6>
          <video controls playsinline preload="metadata" poster="${esc(b.trabalhoFoto)}">
            <source src="${esc(b.trabalhoVideo)}" type="video/mp4">
          </video>
          <figcaption class="media-caption">${esc(b.trabalhoVideoLegenda)}</figcaption>
        </figure>
      </div>
    </div>
    <div class="barber-modal-nav">
      <button type="button" class="barber-nav-btn" data-step="-1" aria-label="Barbeiro anterior: ${esc(prev.nome)}">‹ ${esc(prev.nome)}</button>
      <a class="btn-gold" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer" data-analytics="cta-agendar-${esc(b.id)}">Agendar com ${esc(b.nome)}</a>
      <button type="button" class="barber-nav-btn" data-step="1" aria-label="Próximo barbeiro: ${esc(next.nome)}">${esc(next.nome)} ›</button>
    </div>`;
};

function showBarber(i) {
  current = (i + barbeiros.length) % barbeiros.length;
  const b = barbeiros[current];
  modalTitle.textContent = `Perfil de ${b.nome}`;
  modalBody.innerHTML = barberView(b, current);
  if (!reduced) modalBody.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE });
  history.replaceState(null, '', `#barbeiro-${b.id}`);
}

function openBarber(i) {
  if (!modalEl || !window.bootstrap) return;
  lastTrigger = document.activeElement;
  modal = modal || bootstrap.Modal.getOrCreateInstance(modalEl);
  showBarber(i);
  modal.show();
}

const videoFallback = v => {
  const box = document.createElement('div');
  box.className = 'media-fallback';
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', 'Vídeo em breve');
  box.innerHTML = `${ICON_VID}<span>Vídeo em breve</span>`;
  v.replaceWith(box);
};

if (modalEl) {
  // Mídia ausente → placeholders elegantes (erros não "borbulham": usa captura)
  modalBody.addEventListener('error', e => {
    const t = e.target;
    if (t.tagName === 'IMG') {
      if (t.dataset.initial) t.parentElement.textContent = t.dataset.initial;
      else if (!t.dataset.failed) { t.dataset.failed = '1'; t.src = PLACEHOLDER_IMG; }
    } else if (t.tagName === 'SOURCE') {
      const v = t.closest('video'); if (v) videoFallback(v);
    }
  }, true);

  modalBody.addEventListener('click', e => {
    const btn = e.target.closest('[data-step]');
    if (btn) showBarber(current + Number(btn.dataset.step));
  });

  modalEl.addEventListener('keydown', e => {
    if (e.target.closest('video') || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    showBarber(current + (e.key === 'ArrowRight' ? 1 : -1));
  });

  modalEl.addEventListener('hidden.bs.modal', () => {
    const v = $('video', modalEl);
    if (v) { v.pause(); v.currentTime = 0; }
    modalBody.innerHTML = '';
    current = -1;
    history.replaceState(null, '', '#barbeiros');
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
  });
}

if (barbersRow) barbersRow.addEventListener('click', e => {
  const btn = e.target.closest('[data-barber]');
  if (btn) openBarber(Number(btn.dataset.barber));
});

// Link direto: ...#barbeiro-welliton abre o perfil
const deep = location.hash.match(/^#barbeiro-(.+)$/);
if (deep) {
  const idx = barbeiros.findIndex(b => b.id === deep[1]);
  if (idx > -1) window.addEventListener('load', () => {
    $('#barbeiros')?.scrollIntoView();
    openBarber(idx);
  });
}

/* ============================================================
   CORTES — EDITE AQUI. Campos: nome, categoria ("masculino" |
   "feminino"), preco (texto livre, ex: "R$ 35" — opcional),
   descricao, icone (tesoura | maquina | degrade | pente | gota).
   ============================================================ */
const cortes = [
  { 
    nome: 'Corte na máquina (Mullet)', 
    categoria: 'masculino', 
    preco: '', 
    icone: 'maquina',
    video: 'img/mullet.mp4',
    descricao: 'Corte no estilo Mullet com laterais na máquina/degradê, acabamento limpo no pezinho e textura na nuca.' 
  },
  { 
    nome: 'Corte + Botox', 
    categoria: 'masculino', 
    preco: '', 
    icone: 'gota',
    video: 'img/botox.mp4',
    descricao: 'Alinhamento capilar com Botox para redução de volume, maciez extrema, brilho intenso e fios alinhados.' 
  },
  { 
    nome: 'Degradê', 
    categoria: 'masculino', 
    preco: '', 
    icone: 'degrade',
    video: 'img/degrade.mp4',
    descricao: 'Fade com transição suave do zero ao comprimento desejado — baixo, médio ou alto.' 
  },
  { 
    nome: 'Corte feminino', 
    categoria: 'feminino', 
    preco: '', 
    icone: 'tesoura',
    video: '',
    descricao: 'Corte de tesoura pensado para o formato do rosto e a textura do cabelo, com caimento natural.' 
  },
  { 
    nome: 'Escova', 
    categoria: 'feminino', 
    preco: '', 
    icone: 'pente',
    video: '',
    descricao: 'Modelagem com secador e escova para um acabamento liso e com volume, do dia a dia aos eventos.' 
  },
  {
    nome:"Hidratação", 
    categoria:"feminino", 
    preco:"", 
    descricao:"Descreva aqui o tratamento oferecido.", 
    icone:"✂",
    video: ''
  }
];

const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONES = {
  tesoura: svg('<circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M20 4 8 15.5M14.5 14.5 20 20M8 8.5l4 3.5"/>'),
  maquina: svg('<rect x="8" y="2.5" width="8" height="13" rx="2"/><path d="M8 15.5h8V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20z"/><path d="M10.5 6h3"/>'),
  degrade: svg('<path d="M4 6h16M6 10h12M8 14h8M10 18h4"/>'),
  pente:   svg('<path d="M3 7h18v4H3z"/><path d="M6 11v7M10 11v7M14 11v7M18 11v7"/>'),
  gota:    svg('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
};

const categorias = [
  { id: 'todos', label: 'Todos' },
  { id: 'masculino', label: 'Masculino' },
  { id: 'feminino', label: 'Feminino' },
];
const labelCat = id => categorias.find(c => c.id === id)?.label ?? '';
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const filtrar = f => f === 'todos' ? cortes : cortes.filter(c => c.categoria === f);

const filterBar = $('#filterBar');
const servicesRow = $('#servicesRow');

const serviceCard = c => {
  const equipe = barbeiros.filter(b => b.atende.includes(c.categoria));
  const hasVideo = Boolean(c.video);

  // Exibe a capa congelada do vídeo (#t=0.1) sem autoplay e com o botão central de play
  const mediaContent = hasVideo
    ? `
      <video src="${esc(c.video)}#t=0.1" preload="metadata" playsinline style="width:100%; height:100%; object-fit:cover; pointer-events:none;"></video>
      <button type="button" class="btn-play-overlay" aria-label="Assistir vídeo de ${esc(c.nome)}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Assistir Vídeo</span>
      </button>
    `
    : (ICONES[c.icone] ?? ICONES.tesoura);

  return `
    <div class="col-md-6 col-lg-4">
      <article class="service-card">
        <div class="service-img ${hasVideo ? 'service-img-video' : ''}" 
             ${hasVideo ? `data-video-src="${esc(c.video)}" data-video-title="${esc(c.nome)}"` : ''}>
          ${mediaContent}
        </div>
        <div class="service-body">
          <span class="service-cat">${esc(labelCat(c.categoria))}</span>
          <div class="top">
            <h4>${esc(c.nome)}</h4>
            ${c.preco ? `<span class="service-price">${esc(c.preco)}</span>` : ''}
          </div>
          <p>${esc(c.descricao)}</p>
          <div class="service-foot">
            <div class="service-team" role="group" aria-label="Quem atende">
              ${equipe.map(b => `<span class="team-chip" title="${esc(b.nome)}" aria-label="${esc(b.nome)}">${esc(b.inicial)}</span>`).join('')}
            </div>
            <a class="service-cta" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer"
               data-analytics="cta-agendar-corte-${slug(c.nome)}" aria-label="Agendar ${esc(c.nome)} (abre em nova aba)">Agendar →</a>
          </div>
        </div>
      </article>
    </div>`;
};

function renderServices(filter) {
  servicesRow.innerHTML = filtrar(filter).map(serviceCard).join('');
  revealer.observe([...servicesRow.children]);
}

function setFilter(id, focus = false) {
  $$('.filter-btn', filterBar).forEach(b => {
    const on = b.dataset.cat === id;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
    if (on) { servicesRow.setAttribute('aria-labelledby', b.id); if (focus) b.focus(); }
  });
  renderServices(id);
}

if (filterBar && servicesRow) {
  filterBar.setAttribute('role', 'tablist');
  filterBar.setAttribute('aria-label', 'Filtrar cortes por público');
  servicesRow.setAttribute('role', 'tabpanel');
  servicesRow.setAttribute('aria-live', 'polite');

  filterBar.innerHTML = categorias.map((c, i) => `
    <button type="button" role="tab" id="tab-${c.id}" class="filter-btn ${i ? '' : 'active'}" data-cat="${c.id}"
            aria-selected="${!i}" aria-controls="servicesRow" tabindex="${i ? -1 : 0}">
      ${c.label} <span class="filter-count">${filtrar(c.id).length}</span>
    </button>`).join('');

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (btn && !btn.classList.contains('active')) setFilter(btn.dataset.cat);
  });

  // Navegação por teclado padrão de abas (← → Home End)
  filterBar.addEventListener('keydown', e => {
    const tabs = $$('.filter-btn', filterBar);
    const i = tabs.findIndex(t => t.classList.contains('active'));
    const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    setFilter(tabs[(to + tabs.length) % tabs.length].dataset.cat, true);
  });

  setFilter('todos');
}

/* ============================================================
   NAV — scroll state, menu mobile, link ativo
   ============================================================ */
const nav = $('#mainNav');
const toggle = $('#navToggle');
const mobileMenu = $('#navLinksMobile');

if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (toggle && mobileMenu) {
  const setMenu = open => {
    mobileMenu.style.display = open ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(mobileMenu.style.display !== 'block'));
  $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
}

const sections = ['sobre', 'barbeiros', 'cortes', 'localizacao', 'faq'].map(id => document.getElementById(id)).filter(Boolean);
const navAnchors = $$('.nav-links a[href^="#"]');
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

/* ============================================================
   ANALYTICS — delegação: vale também para elementos criados via JS
   ============================================================ */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-analytics]');
  if (el && typeof gtag === 'function') {
    gtag('event', 'click_cta', { event_category: 'Agendamento', event_label: el.getAttribute('data-analytics') });
  }
});

/* ============================================================
   EFEITO NOS ÍCONES SOCIAIS DO TOPO
   ============================================================ */
$$('.nav-social-ic').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.classList.add('js-social-effect');
    setTimeout(() => icon.classList.remove('js-social-effect'), 500);
  });
});

/* ============================================================
   EVENTO DE CLIQUE E MODAL PARA EXIBIR VÍDEO DO CORTE
   ============================================================ */
document.addEventListener('click', e => {
  const videoCard = e.target.closest('.service-img-video');
  if (videoCard) {
    const videoSrc = videoCard.dataset.videoSrc;
    const videoTitle = videoCard.dataset.videoTitle;
    if (videoSrc) {
      openVideoModal(videoSrc, videoTitle);
    }
  }
});

function openVideoModal(src, title) {
  let modalEl = document.getElementById('corteVideoModal');
  
  // Cria a modal dinamicamente caso ela ainda não exista na página
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'corteVideoModal';
    modalEl.className = 'modal fade';
    modalEl.tabIndex = -1;
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content barber-modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title font-serif" style="color: var(--gold-light); font-weight: 600;"></h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body p-3 text-center">
            <video controls autoplay playsinline style="width:100%; max-height:75vh; border-radius:var(--radius); border:1px solid var(--line); object-fit:contain;"></video>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modalEl);
  }
  
  // Atualiza o título e a fonte do vídeo
  modalEl.querySelector('.modal-title').textContent = title || 'Demonstração do Corte';
  const videoEl = modalEl.querySelector('video');
  videoEl.src = src;
  
  // Abre a modal do Bootstrap e reproduz com áudio
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();

  // Pausa e limpa o vídeo ao fechar a modal
  modalEl.addEventListener('hidden.bs.modal', () => {
    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.src = '';
  }, { once: true });
}

})();

/*

// OCULTAR PRELOADER APÓS O CARREGAMENTO DA PÁGINA
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Pequeno delay de 400ms para uma transição suave
    setTimeout(() => {
      preloader.classList.add('fade-out');
      
      // Remove do fluxo de renderização após o encerramento do efeito fade (600ms)
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }, 400);
  }
});
*/