document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   BARBEIROS — edite aqui para trocar nomes/funções
   ============================================================ */
const barbeiros = [
  { 
    nome: "Lucas", 
    inicial: "L", 
    foto: "", // Caso Lucas não tenha foto, manterá a inicial
    cargo: "Fundador da barbearia", 
    publico: "Masculino e feminino" 
  },
  { 
    nome: "Welliton", 
    inicial: "W", 
    foto: "img/welliton.jpeg", // Nome do arquivo de foto do Welliton
    cargo: "Barbeiro", 
    publico: "Masculino" 
  },
  { 
    nome: "Davi", 
    inicial: "D", 
    foto: "img/davi.jpeg", // Nome do arquivo de foto do Davi
    cargo: "Barbeiro", 
    publico: "Masculino" 
  },
];

const barbersRow = document.getElementById('barbersRow');
barbersRow.innerHTML = barbeiros.map(b => `
  <div class="col-md-4">
    <div class="barber-card">
      <div class="barber-avatar">
        ${b.foto ? `<img src="${b.foto}" alt="${b.nome}">` : b.inicial}
      </div>
      <h3>${b.nome}</h3>
      <div class="role">${b.cargo}</div>
      <div class="barber-tag">${b.publico}</div>
    </div>
  </div>
`).join('');

/* ============================================================
   CORTES — EDITE AQUI as informações de cada corte.
   Campos: nome, categoria ("masculino" | "feminino"), preco
   (texto livre, ex: "R$ 35" — opcional), descricao, icone
   (emoji ou letra usada como marcador visual do card).
   Duplique um objeto no array para adicionar um novo corte.
   ============================================================ */
const cortes = [
  { nome:"Corte na máquina", categoria:"masculino", preco:"", descricao:"Descreva aqui o estilo e o acabamento deste corte.", icone:"✂" },
  { nome:"Corte + barba", categoria:"masculino", preco:"", descricao:"Descreva aqui o que está incluso neste combo.", icone:"✂" },
  { nome:"Degradê", categoria:"masculino", preco:"", descricao:"Descreva aqui os detalhes do acabamento.", icone:"✂" },
  { nome:"Corte feminino", categoria:"feminino", preco:"", descricao:"Descreva aqui o estilo deste corte feminino.", icone:"✂" },
  { nome:"Escova", categoria:"feminino", preco:"", descricao:"Descreva aqui o serviço de escova oferecido.", icone:"✂" },
  { nome:"Hidratação", categoria:"feminino", preco:"", descricao:"Descreva aqui o tratamento oferecido.", icone:"✂" },
];

const categorias = [
  { id:"todos", label:"Todos" },
  { id:"masculino", label:"Masculino" },
  { id:"feminino", label:"Feminino" },
];

const filterBar = document.getElementById('filterBar');
const servicesRow = document.getElementById('servicesRow');

filterBar.innerHTML = categorias.map((c,i) =>
  `<button class="filter-btn ${i===0?'active':''}" data-cat="${c.id}">${c.label}</button>`
).join('');

function renderServices(filter){
  const list = filter === 'todos' ? cortes : cortes.filter(c => c.categoria === filter);
  servicesRow.innerHTML = list.map(c => `
    <div class="col-md-6 col-lg-4">
      <div class="service-card">
        <div class="service-img">${c.icone}</div>
        <div class="service-body">
          <span class="service-cat">${c.categoria === 'masculino' ? 'Masculino' : 'Feminino'}</span>
          <div class="top">
            <h4>${c.nome}</h4>
            ${c.preco ? `<span class="service-price">${c.preco}</span>` : ''}
          </div>
          <p>${c.descricao}</p>
        </div>
      </div>
    </div>
  `).join('');
}
renderServices('todos');

filterBar.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if(!btn) return;
  filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderServices(btn.dataset.cat);
});

/* ============================================================
   NAV — scroll state, menu mobile, link ativo
   ============================================================ */
const nav = document.getElementById('mainNav');
const toggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('navLinksMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive:true });

toggle.addEventListener('click', () => {
  const open = mobileMenu.style.display === 'block';
  mobileMenu.style.display = open ? 'none' : 'block';
  toggle.setAttribute('aria-expanded', String(!open));
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.style.display = 'none';
  toggle.setAttribute('aria-expanded','false');
}));

const sections = ['sobre','barbeiros','cortes','localizacao'].map(id => document.getElementById(id));
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && spy.observe(s));

document.querySelectorAll('[data-analytics]').forEach(button => {
  button.addEventListener('click', (e) => {
    const label = e.currentTarget.getAttribute('data-analytics');
    
    // Dispara evento para o Google Analytics 4 (se configurado)
    if (typeof gtag === 'function') {
      gtag('event', 'click_cta', {
        'event_category': 'Agendamento',
        'event_label': label
      });
    }
  });
});