const SVC_ICONS = [
  ["scissors", "Tesoura"],
  ["brush", "Pincel"],
  ["combo", "Corte + barba"],
  ["spray", "Finalização"],
  ["star", "Destaque"],
];
const SVC_EMOJI = {
  "✂️": "scissors",
  "✂": "scissors",
  "🪒": "brush",
  "💈": "combo",
  "✨": "spray",
};
const svcKey = (s) => SVC_EMOJI[s?.icon] || (window.__icons[s?.icon] ? s.icon : "scissors");
const svcIcon = (s, c) => ic("scissors", c);
function zoomPhoto(src, name) {
  $("#overlay").innerHTML =
    `<div class="photo-zoom" onclick="closeModal()" role="dialog" aria-modal="true" aria-label="${name}"><button class="photo-zoom-close" onclick="closeModal()" aria-label="Fechar">${ic("x")}</button><figure onclick="event.stopPropagation()"><img src="${src}" alt="${name}"><figcaption>${name}</figcaption></figure></div>`;
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.querySelector(".photo-zoom")) closeModal();
});

const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
const iso = (d) => {
  let a = new Date(d);
  return `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}-${String(a.getDate()).padStart(2, "0")}`;
};
const today = iso(new Date());
const addDays = (date, n) => {
  let d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};
const pretty = (date) =>
  new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
const money = (n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const uid = () => Math.random().toString(36).slice(2, 10);
const dayOf = (date) => new Date(date + "T12:00:00").getDay();
let base = {
  shop: {
    name: "Barbearia - Rafael Úzeda",
    tagline: "Minha prioridade é a sua autoestima. Desde 2018.",
    whatsapp: "",
    address: "Seu espaço, sua experiência.",
  },
  services: [
    { id: "s1", name: "Corte masculino", duration: 30, price: 40, icon: "scissors", active: true },
    { id: "s2", name: "Barba", duration: 30, price: 30, icon: "brush", active: true },
    { id: "s3", name: "Cabelo + barba", duration: 60, price: 65, icon: "combo", active: true },
    { id: "s4", name: "Acabamento", duration: 20, price: 20, icon: "spray", active: true },
  ],
  staff: [
    {
      id: "p1",
      name: "Lucas Oliveira",
      role: "Proprietário • Barbeiro",
      start: "09:00",
      end: "18:00",
      days: [1, 2, 3, 4, 5, 6],
      active: true,
    },
    {
      id: "p2",
      name: "Rafael Santos",
      role: "Barbeiro",
      start: "10:00",
      end: "19:00",
      days: [2, 3, 4, 5, 6],
      active: true,
    },
  ],
  bookings: [],
  notices: [
    {
      id: "n1",
      date: addDays(today, 3),
      staffId: "all",
      type: "block",
      title: "Barbearia fechada",
      detail: "Não haverá atendimento nesta data.",
    },
  ],
  payments: [],
};
const demo = [
  ["09:00", "Mateus Lima", "s1", "p1", "confirmado", 0],
  ["10:00", "Pedro Costa", "s3", "p2", "confirmado", 0],
  ["11:30", "Bruno Alves", "s2", "p1", "concluido", 0],
  ["14:00", "André Souza", "s3", "p1", "confirmado", 0],
  ["15:30", "Caio Rocha", "s1", "p2", "pendente", 0],
  ["16:00", "Thiago Melo", "s2", "p1", "confirmado", 1],
  ["10:30", "Felipe Araújo", "s3", "p2", "confirmado", 2],
];
base.bookings = demo.map((b, i) => ({
  id: "b" + i,
  date: addDays(today, b[5]),
  time: b[0],
  customer: b[1],
  phone: "",
  serviceId: b[2],
  staffId: b[3],
  status: b[4],
  paid: i === 2,
  paymentMethod: i === 2 ? "Pix" : null,
}));

const svcList = (s) =>
  (Array.isArray(s) ? s : [s]).map((id) => db.services.find((x) => x.id === id)).filter(Boolean);
const svcTotal = (s) => {
  let l = svcList(s);
  return l.length
    ? {
        name: l.map((x) => x.name).join(" + "),
        duration: l.reduce((a, x) => a + +x.duration, 0),
        price: l.reduce((a, x) => a + +x.price, 0),
      }
    : null;
};
const bookDur = (b) => svcTotal(b.serviceIds || b.serviceId)?.duration || 30;
const avatarOf = (p) =>
  p.photo
    ? `<img class="avatar avatar-img" src="${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.outerHTML='<div class=&quot;avatar&quot;>${esc((p.name || "?")[0])}</div>'">`
    : `<div class="avatar">${esc((p.name || "?")[0])}</div>`;
let theme = localStorage.getItem("barberTheme") || "dark";
function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  localStorage.setItem("barberTheme", theme);
  render();
}
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
let calMonth = today.slice(0, 7);
function setCal(y, m) {
  let d = new Date(+y, +m, 1);
  let v = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (v < today.slice(0, 7)) v = today.slice(0, 7);
  calMonth = v;
  render();
}
function shiftCal(n) {
  let [y, m] = calMonth.split("-").map(Number);
  setCal(y, m - 1 + n);
}
function monthCalendar(d) {
  let [y, m] = calMonth.split("-").map(Number);
  let first = new Date(y, m - 1, 1),
    days = new Date(y, m, 0).getDate(),
    cur = today.slice(0, 7),
    ty = +today.slice(0, 4);
  let years = Array.from({ length: 4 }, (_, i) => ty + i);
  let cells = Array.from({ length: first.getDay() }, () => '<span class="cal-blank"></span>');
  for (let i = 1; i <= days; i++) {
    let x = `${calMonth}-${String(i).padStart(2, "0")}`;
    if (x < today) {
      cells.push(`<button class="date-button past" disabled><strong>${i}</strong></button>`);
      continue;
    }
    let st = dayAvailability(x);
    cells.push(
      `<button ${st.code === "closed" || st.code === "full" ? "disabled" : ""} class="date-button ${st.code} ${d === x ? "selected" : ""}" title="${st.label}" aria-label="${i} de ${MONTHS[m - 1]}: ${st.label}" onclick="flow.date='${x}';flow.time=null;flow.confirmStaff=null;render()"><strong>${i}</strong><small>${st.label}</small></button>`,
    );
  }
  return `<div class="mcal-head"><button class="btn small ghost" ${calMonth <= cur ? "disabled" : ""} onclick="shiftCal(-1)" aria-label="Mês anterior">${ic("chevLeft")}</button><div class="cal-selects"><select aria-label="Mês" onchange="setCal(${y},this.value)">${MONTHS.map((n, i) => `<option value="${i}" ${i === m - 1 ? "selected" : ""} ${y === ty && i < +today.slice(5, 7) - 1 ? "disabled" : ""}>${n}</option>`).join("")}</select><select aria-label="Ano" onchange="setCal(this.value,${m - 1})">${years.map((v) => `<option ${v === y ? "selected" : ""}>${v}</option>`).join("")}</select></div><button class="btn small ghost" onclick="shiftCal(1)" aria-label="Próximo mês">${ic("chevRight")}</button></div><div class="dates cal-grid-month">${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((w) => `<span class="cal-wd">${w}</span>`).join("")}${cells.join("")}</div>`;
}
let bf = { date: "", service: "", staff: "", name: "", status: "" },
  cf = { name: "", staff: "" };
function applyBookingFilter() {
  bf = {
    date: $("#bfDate").value,
    service: $("#bfService").value,
    staff: $("#bfStaff").value,
    name: $("#bfName").value.trim(),
    status: $("#bfStatus").value,
  };
  render();
}
function liveFilter(fn, id) {
  const el = document.getElementById(id),
    pos = el && el.selectionStart;
  fn();
  const n = document.getElementById(id);
  if (n && id.endsWith("Name")) {
    n.focus();
    try {
      n.setSelectionRange(pos, pos);
    } catch (e) {}
  }
}
let ftm;
function typeFilter(fn, id) {
  clearTimeout(ftm);
  ftm = setTimeout(() => liveFilter(fn, id), 250);
}
function applyClientFilter() {
  cf = { name: $("#cfName").value.trim(), staff: $("#cfStaff").value };
  render();
}
const norm = (t) =>
  String(t || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function newBooking() {
  calMonth = today.slice(0, 7);
  flow = { serviceIds: [], staffId: null, date: null, time: null, customer: "", phone: "" };
  step = 1;
  view = "booking";
  render();
  window.scrollTo(0, 0);
}
function toggleSvc(id) {
  let a = flow.serviceIds || (flow.serviceIds = []);
  let i = a.indexOf(id);
  if (i >= 0) a.splice(i, 1);
  else a.push(id);
  flow.serviceId = a[0] || null;
  flow.time = null;
  render();
}
let db = structuredClone(base),
  token = window.__barberToken || "",
  serverReady = false,
  writeQueue = Promise.resolve();
async function request(route, options = {}) {
  return window.__barberApi(route, options);
}
async function refreshState() {
  db = await request(token ? "/admin/state" : "/public");
  serverReady = true;
  render();
}
function save() {
  if (!token) {
    toast("Faça login para editar dados.");
    return;
  }
  const snapshot = JSON.stringify(db);
  writeQueue = writeQueue
    .then(() => request("/admin/state", { method: "PUT", body: snapshot }))
    .catch(async (e) => {
      toast("Erro ao salvar: " + e.message);
      try {
        await refreshState();
      } catch {}
    });
  return writeQueue;
}
async function login() {
  const email = document.querySelector("#loginEmail")?.value,
    password = document.querySelector("#loginPassword")?.value;
  $("#overlay").innerHTML =
    `<div class="confirm-layer"><div class="confirm-card" role="status" aria-live="polite"><div class="spinner"></div><h2>Entrando na gestão</h2><p class="muted">Verificando seu acesso, aguarde um instante...</p></div></div>`;
  try {
    const data = await request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    token = data.token;
    await refreshState();
    view = "admin";
    closeModal();
    render();
  } catch (e) {
    closeModal();
    toast(e.message);
  }
}
async function logout() {
  try {
    await request("/logout", { method: "POST" });
  } catch {}
  token = "";
  view = "public";
  await refreshState();
}
function setAuth(m) {
  authMode = m;
  render();
}
function busy(t, s) {
  $("#overlay").innerHTML =
    `<div class="confirm-layer"><div class="confirm-card" role="status" aria-live="polite"><div class="spinner"></div><h2>${t}</h2><p class="muted">${s}</p></div></div>`;
}
async function sendReset() {
  const email = $("#fgEmail").value.trim();
  if (!email) {
    toast("Informe seu e-mail.");
    return;
  }
  busy("Enviando código", "Aguarde um instante...");
  try {
    await request("/forgot", { method: "POST", body: JSON.stringify({ email }) });
    resetEmail = email;
    closeModal();
    authMode = "reset";
    render();
    toast("Enviamos um código para " + email);
  } catch (e) {
    closeModal();
    toast(e.message);
  }
}
async function doReset() {
  const email = $("#rsEmail")?.value.trim() || resetEmail,
    code = $("#rsCode")?.value.trim() || "",
    p1 = $("#rsPass").value,
    p2 = $("#rsPass2").value;
  if (p1 !== p2) {
    toast("As senhas não conferem.");
    return;
  }
  if (p1.length < 6) {
    toast("A nova senha precisa ter pelo menos 6 caracteres.");
    return;
  }
  if (authMode === "reset" && window.__barberStartView !== "reset-link" && !code) {
    toast("Informe o código recebido por e-mail.");
    return;
  }
  busy("Alterando senha", "Aguarde um instante...");
  try {
    await request("/reset", {
      method: "POST",
      body: JSON.stringify({ email, code, password: p1 }),
    });
    closeModal();
    window.__barberStartView = "admin";
    history.replaceState(null, "", "/login");
    authMode = "login";
    render();
    toast("Senha alterada com sucesso. Entre com a nova senha.");
  } catch (e) {
    closeModal();
    toast(e.message);
  }
}
function loginPage() {
  let link = window.__barberStartView === "reset-link";
  let inner =
    authMode === "forgot"
      ? `<span class="eyebrow">Recuperar acesso</span><h1 style="margin-top:12px">Esqueceu a senha?</h1><p class="muted">Informe o e-mail cadastrado. Vamos enviar um código para você criar uma nova senha.</p><form class="forms" onsubmit="event.preventDefault();sendReset()"><label>E-mail<input type="email" id="fgEmail" required autocomplete="username" value="${esc(resetEmail)}"></label><button class="btn primary" type="submit">Enviar código ${ic("arrowRight")}</button></form><button class="auth-link" onclick="setAuth('login')">Voltar para o login</button>`
      : authMode === "reset"
        ? `<span class="eyebrow">Nova senha</span><h1 style="margin-top:12px">Redefinir senha</h1><p class="muted">${link ? "Crie sua nova senha abaixo." : "Digite o código que chegou no seu e-mail e escolha a nova senha."}</p><form class="forms" onsubmit="event.preventDefault();doReset()">${link ? "" : `<label>E-mail<input type="email" id="rsEmail" required value="${esc(resetEmail)}"></label><label>Código recebido<input id="rsCode" inputmode="numeric" autocomplete="one-time-code" maxlength="10" required placeholder="000000"></label>`}<label>Nova senha<input id="rsPass" type="password" minlength="6" required autocomplete="new-password"></label><label>Confirmar nova senha<input id="rsPass2" type="password" minlength="6" required autocomplete="new-password"></label><button class="btn primary" type="submit">Alterar senha ${ic("check")}</button></form><div class="auth-row">${link ? "" : `<button class="auth-link" onclick="setAuth('forgot')">Reenviar código</button>`}<button class="auth-link" onclick="setAuth('login')">Voltar para o login</button></div>`
        : `<span class="eyebrow">Acesso restrito</span><h1 style="margin-top:12px">Entrar na gestão</h1><p class="muted">Apenas o proprietário pode alterar a agenda.</p><form class="forms" onsubmit="event.preventDefault();login()"><label>E-mail<input type="email" id="loginEmail" required autocomplete="username" value="admin@rafaeluzeda.com"></label><label>Senha<input id="loginPassword" type="password" required autocomplete="current-password" value="Barbearia@2026"></label><button class="btn primary" type="submit">Entrar no painel ${ic("arrowRight")}</button></form><button class="auth-link" onclick="resetEmail=$('#loginEmail').value;setAuth('forgot')">Esqueceu a senha?</button>`;
  return `<main style="max-width:440px;margin:70px auto;padding:25px"><div class="card auth-card">${inner}</div></main>`;
}
let view = ["admin", "reset-link"].includes(window.__barberStartView) ? "admin" : "public",
  authMode = window.__barberStartView === "reset-link" ? "reset" : "login",
  resetEmail = "",
  sideCollapsed = localStorage.getItem("barberSide") === "1",
  section = "overview",
  date = today,
  step = 1,
  flow = { serviceId: null, staffId: null, date: null, time: null, customer: "", phone: "" };
const service = (id) => db.services.find((x) => x.id === id),
  staff = (id) => db.staff.find((x) => x.id === id),
  occurs = (n, d, p) => n.date === d && (n.staffId === "all" || n.staffId === p),
  minutes = (t) => Number(t.split(":")[0]) * 60 + Number(t.split(":")[1]),
  clock = (n) =>
    String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");
const closed = (d, p) => db.notices.some((n) => n.type === "block" && occurs(n, d, p));
const staffHours = (employee, d) =>
  employee.weekly?.[dayOf(d)] || {
    mode: employee.days.includes(dayOf(d)) ? "default" : "closed",
    start: employee.start,
    end: employee.end,
  };
const openSlots = (d, p, s, exclude) => {
  let employee = staff(p),
    sv = svcTotal(s);
  if (
    !employee ||
    !sv ||
    !employee.active ||
    staffHours(employee, d).mode === "closed" ||
    closed(d, p)
  )
    return [];
  let output = [];
  for (
    let m = minutes(
      staffHours(employee, d).mode === "custom" ? staffHours(employee, d).start : employee.start,
    );
    m + sv.duration <=
    minutes(staffHours(employee, d).mode === "custom" ? staffHours(employee, d).end : employee.end);
    m += 10
  ) {
    let overlap = db.bookings.some(
      (b) =>
        b.id !== exclude &&
        b.date === d &&
        b.staffId === p &&
        b.status !== "cancelado" &&
        m < minutes(b.time) + bookDur(b) &&
        m + sv.duration > minutes(b.time),
    );
    if (!overlap) output.push(clock(m));
  }
  return output;
};
const servicePicker = () =>
  db.services
    .filter((x) => x.active)
    .map(
      (s, i) =>
        `<article class="service-card" onclick="startBooking('${s.id}')"><div class="svc-top"><div class="service-icon">${svcIcon(s, "ic-md")}</div><span class="svc-index">${String(i + 1).padStart(2, "0")}</span></div><h3>${esc(s.name)}</h3><span class="svc-duration">${ic("clock")} ${s.duration} min</span><div class="svc-foot"><div class="svc-price"><small>A partir de</small><strong>${money(s.price)}</strong></div><button class="svc-cta" onclick="event.stopPropagation();startBooking('${s.id}')" aria-label="Agendar ${esc(s.name)}">Agendar ${ic("arrowUpRight")}</button></div></article>`,
    )
    .join("");
function header() {
  return `<header class="topbar ${view === "admin" && token ? "" : "topbar-public"}"><div class="brand" onclick="go('public')" style="cursor:pointer"><img class="brand-logo" src="/assets/logo_rafael_uzeda.png" alt="Barbearia Rafael Úzeda"><span class="brand-name">RAFAEL <span style="color:var(--gold)">ÚZEDA</span><small>Barbearia</small></span></div><div class="top-actions"><button class="btn ghost only-desktop" onclick="go('public')">Site do cliente</button><button class="btn ${view === "admin" ? "primary" : "ghost"}" onclick="go('admin')">${ic("settings")} <span>Gestão</span></button><button class="btn ${view === "booking" ? "primary" : "ghost"}" onclick="newBooking()">${ic("calendarPlus")} <span>Agendar</span></button></div></header>`;
}
function publicPage() {
  return `<div class="public-hero"><div class="hero-inner"><span class="eyebrow">Sua barbearia, seu estilo</span><h1>Mais que um corte.<br><span style="color:var(--gold)">Uma experiência.</span></h1><p>${esc(db.shop.tagline)} Agende seu horário em poucos passos, sem precisar ligar ou esperar.</p><div class="hero-actions"><button class="btn primary" onclick="newBooking()">Agendar meu horário ${ic("arrowRight")}</button><a class="btn ghost" href="${db.shop.whatsapp ? "https://wa.me/" + db.shop.whatsapp.replace(/\D/g, "") : "#services"}">${db.shop.whatsapp ? `${ic("whatsapp")} WhatsApp` : `Ver serviços ${ic("arrowDown")}`}</a></div><div class="hero-ribbon"><span>${ic("award")} Atendimento personalizado</span><span>${ic("shield")} Profissionais experientes</span><span>${ic("clock")} Seu horário, no seu ritmo</span></div></div></div><main><section class="wrap section" id="services"><div class="section-title"><div><div class="eyebrow">O QUE FAZEMOS</div><h2>Nossos serviços</h2><div class="muted">Escolha como quer renovar seu visual.</div></div><span class="chip">Atendimento com horário marcado</span></div><div class="service-grid">${servicePicker()}</div></section><section class="wrap section" style="border-top:1px solid var(--line)"><div class="section-title"><div><div class="eyebrow">NOSSO TIME</div><h2>Quem cuida do seu estilo</h2></div></div><div class="team-grid">${db.staff
    .filter((x) => x.active)
    .map(
      (p) =>
        `<div class="card team-card">${p.photo ? `<button class="team-photo-btn" onclick="zoomPhoto('${esc(p.photo)}','${esc(p.name)}')" aria-label="Ampliar foto de ${esc(p.name)}"><img class="team-photo" src="${esc(p.photo)}" alt="${esc(p.name)}"><span class="team-photo-zoom">${ic("plus")}</span></button>` : `${avatarOf(p)}`}<div><h3 style="margin:0">${esc(p.name)}</h3><p>${esc(p.role)}</p></div><button class="btn small" style="margin-left:auto" onclick="chooseProfessional('${p.id}')">Agendar</button></div>`,
    )
    .join(
      "",
    )}</div></section><section class="wrap section essence" style="border-top:1px solid var(--line)"><div class="eyebrow">NOSSA ESSÊNCIA</div><h2>Uma pausa para você.</h2><p class="muted">${esc(db.shop.address)}</p><button class="btn primary essence-cta" onclick="newBooking()">Reservar um horário</button></section></main><footer class="site-footer"><div class="wrap foot-grid"><div class="foot-brand"><img src="/assets/logo_rafael_uzeda.png" alt="Barbearia Rafael Úzeda"><p>${esc(db.shop.tagline)}</p></div><div><h4>Endereço</h4><p class="foot-line">${ic("mapPin")}<span>${esc(db.shop.address)}</span></p></div><div><h4>Contato</h4><a class="foot-line" href="${db.shop.whatsapp ? "https://wa.me/" + db.shop.whatsapp.replace(/\D/g, "") : "#"}" target="_blank" rel="noopener">${ic("whatsapp")}<span>WhatsApp ${esc(db.shop.phone || "")}</span></a><a class="foot-line" href="tel:+${esc(db.shop.whatsapp || "")}">${ic("phone")}<span>${esc(db.shop.phone || "")}</span></a>${db.shop.instagram ? `<a class="foot-line" href="${esc(db.shop.instagram)}" target="_blank" rel="noopener">${ic("instagram")}<span>@rafaeluzeda_</span></a>` : ""}</div><div><h4>Formas de pagamento</h4><p class="foot-line">${ic("banknote")}<span>Dinheiro</span></p><p class="foot-line">${ic("card")}<span>Cartão de crédito</span></p><p class="foot-line">${ic("card")}<span>Cartão de débito</span></p></div></div><div class="foot-bottom">© ${new Date().getFullYear()} ${esc(db.shop.name)}. Todos os direitos reservados.</div></footer>`;
}
function go(v, s) {
  view = v;
  if (s) section = s;
  render();
  window.scrollTo(0, 0);
}
function startBooking(id) {
  flow = {
    serviceIds: [id],
    serviceId: id,
    staffId: null,
    date: null,
    time: null,
    customer: "",
    phone: "",
  };
  step = 2;
  view = "booking";
  render();
  window.scrollTo(0, 0);
}
function chooseProfessional(id) {
  flow = { serviceIds: [], staffId: id, date: null, time: null, customer: "", phone: "" };
  step = 1;
  view = "booking";
  render();
  window.scrollTo(0, 0);
}
function bookingPage() {
  let ss = svcTotal(flow.serviceIds || []);
  let body = "";
  if (step === 1) {
    let sel = flow.serviceIds || [];
    body = `<h2>Escolha seu serviço</h2><p class="muted">Qual cuidado você merece hoje? Você pode escolher mais de um.</p><div class="sel-count">${ic("check")}<span>Serviços selecionados: <b>${sel.length}</b></span>${sel.length ? `<em>${ss.duration} min · ${money(ss.price)}</em>` : ""}</div>${db.services
      .filter((x) => x.active)
      .map((s) => {
        let on = sel.includes(s.id);
        return `<div class="choice ${on ? "selected" : ""}" role="checkbox" aria-checked="${on}" tabindex="0" onclick="toggleSvc('${s.id}')"><div class="choice-main"><span class="choice-check">${on ? ic("check") : ""}</span><div><strong>${esc(s.name)}</strong><p>${ic("clock")} ${s.duration} minutos</p></div></div><strong class="price">${money(s.price)}</strong></div>`;
      })
      .join("")}`;
  }
  if (step === 2)
    body = `<h2>Escolha o profissional</h2><p class="muted">Selecione quem vai atender você.</p><div class="choice ${flow.staffId === "any" ? "selected" : ""}" onclick="flow.staffId='any';step=3;render()"><div><strong>${ic("users")} Sem preferência</strong><p>Encontre horários com qualquer profissional disponível.</p></div>${ic("chevRight")}</div>${db.staff
      .filter((x) => x.active)
      .map(
        (p) =>
          `<div class="choice ${flow.staffId === p.id ? "selected" : ""}" onclick="flow.staffId='${p.id}';step=3;render()"><div style="display:flex;align-items:center;gap:12px">${avatarOf(p)}<div><strong>${esc(p.name)}</strong><p>${esc(p.role)}</p></div></div>${ic("chevRight")}</div>`,
      )
      .join("")}`;
  if (step === 3) {
    let d = flow.date || null;
    let alerts = db.notices.filter(
      (n) =>
        n.date === d &&
        (n.staffId === "all" || flow.staffId === "any" || n.staffId === flow.staffId),
    );
    let options = d ? possibleTimes(d) : [];
    let reserved = d ? reservedTimes(d, options) : [];
    let slots = [
      ...options.map((o) => ({ ...o, free: true })),
      ...reserved.map((t) => ({ time: t, free: false })),
    ].sort((a, b) => a.time.localeCompare(b.time));
    body = `<h2>Data e horário</h2><p class="muted">Escolha um dia e veja os horários disponíveis.</p><div class="availability-legend"><span><i style="background:#51b77e"></i>Disponível</span><span><i style="background:#e8c15a"></i>Poucas vagas</span><span><i style="background:#db854b"></i>Lotado</span><span><i style="background:#d65b65"></i>Fechado</span></div><div class="card" style="margin-bottom:15px"><h3 style="margin-bottom:12px">${d ? pretty(d) : "Selecione uma data"}</h3>${monthCalendar(d)}</div>${alerts.map((n) => `<div class="notice"><strong>${ic("alert")} ${esc(n.title)}</strong>${esc(n.detail)}${n.type === "block" ? "<br><small>Horários indisponíveis para o profissional afetado.</small>" : ""}</div>`).join("")}<div class="card"><h3>Horários disponíveis</h3>${!d ? '<div class="times-empty">' + ic("calendar") + "<span>Por favor, escolha uma data para verificar os horários disponíveis.</span></div>" : `<div class="times">${slots.length ? slots.map((t) => (t.free ? `<button class="time-button ${flow.time === t.time && flow.confirmStaff === t.staffId ? "selected" : ""}" onclick="flow.time='${t.time}';flow.confirmStaff='${t.staffId}';render()">${t.time}${flow.staffId === "any" ? `<small>${esc(staff(t.staffId).name.split(" ")[0])}</small>` : ""}</button>` : `<button class="time-button reserved" disabled aria-label="${t.time} reservado">${t.time}<small>${ic("ban")} Reservado</small></button>`)).join("") : '<div class="empty" style="grid-column:1/-1">Nenhum horário disponível para esta data. Escolha outro dia.</div>'}</div>`}</div>`;
  }
  if (step === 4)
    body = `<h2>Finalizar agendamento</h2><p class="muted">Confira os dados e informe seu contato.</p><div class="summary-box"><strong>${esc(ss?.name)} · ${money(ss?.price)}</strong><span>${ic("clock")} ${ss?.duration} minutos</span><span>${ic("user")} ${esc(staff(flow.confirmStaff)?.name)}</span><span>${ic("calendar")} ${pretty(flow.date)} às ${flow.time}</span><span class="muted">Pagamento diretamente na barbearia.</span></div><div class="forms" style="margin-top:20px"><label>Seu nome completo<input id="clientName" placeholder="Ex.: João Silva" value="${esc(flow.customer)}" oninput="flow.customer=this.value"></label><label>Seu WhatsApp<input id="clientPhone" placeholder="(79) 99999-9999" value="${esc(flow.phone)}" oninput="flow.phone=this.value"></label></div>`;
  if (step === 5)
    body = `<div class="success"><div class="success-icon">${ic("check", "ic-lg")}</div><h2>Agendamento confirmado!</h2><p class="muted">Seu horário está reservado. Esperamos você!</p><div class="summary-box" style="text-align:left;margin:25px auto"><strong>${esc(ss?.name)}</strong><span>${pretty(flow.date)} · ${flow.time}</span><span>Profissional: ${esc(staff(flow.confirmStaff)?.name)}</span><span>Valor: ${money(ss?.price)} • Pagamento no local</span></div><button class="btn primary" onclick="step=1;flow={};render()">Novo agendamento</button><button class="btn ghost" style="margin-left:9px" onclick="go('public')">Página inicial</button></div>`;
  return `<div class="booking-area"><span class="eyebrow">AGENDE EM POUCOS PASSOS</span><h1 style="font-size:34px;margin:10px 0 25px">Seu próximo corte começa aqui.</h1><div class="steps">${["Serviço", "Profissional", "Data e hora", "Confirmação"].map((n, i) => `<div class="step ${step >= i + 1 ? "active" : ""}">${i + 1}. ${n}</div>`).join("")}</div>${body}${step < 5 ? `<div class="booking-foot">${step > 1 ? `<button class="btn ghost" onclick="step--;render()">${ic("arrowLeft")} Voltar</button>` : "<span></span>"}${step === 1 ? `<button class="btn primary" ${!(flow.serviceIds || []).length ? "disabled" : ""} onclick="step=2;render()">Continuar ${ic("arrowRight")}</button>` : ""}${step === 3 ? `<button class="btn primary" ${!flow.time ? "disabled" : ""} onclick="step=4;render()">Continuar ${ic("arrowRight")}</button>` : step === 4 ? `<button class="btn primary" onclick="confirmBooking()">Confirmar horário ${ic("check")}</button>` : ""}</div>` : ""}</div>`;
}
function dayAvailability(d) {
  let active = db.staff.filter(
    (p) => p.active && (flow.staffId === "any" || p.id === flow.staffId),
  );
  let working = active.filter((p) => staffHours(p, d).mode !== "closed" && !closed(d, p));
  if (!working.length) return { code: "closed", label: "Fechado" };
  let ids = working.map((p) => p.id),
    total = ids.reduce((a, id) => a + openSlots(d, id, flow.serviceIds).length, 0);
  let available = ids.reduce(
    (a, id) =>
      a +
      openSlots(d, id, flow.serviceIds).filter(
        (t) => d !== today || minutes(t) > new Date().getHours() * 60 + new Date().getMinutes(),
      ).length,
    0,
  );
  if (!available) return { code: "full", label: "Lotado" };
  if (available <= Math.max(3, Math.floor(total * 0.28)))
    return { code: "partial", label: "Poucas vagas" };
  return { code: "available", label: "Livre" };
}
function possibleTimes(d) {
  let ids =
    flow.staffId === "any" ? db.staff.filter((x) => x.active).map((x) => x.id) : [flow.staffId];
  return ids
    .flatMap((id) =>
      openSlots(d, id, flow.serviceIds)
        .filter(
          (t) => d !== today || minutes(t) > new Date().getHours() * 60 + new Date().getMinutes(),
        )
        .map((time) => ({ time, staffId: id })),
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .filter((x, i, a) => i < 45);
}
function reservedTimes(d, options) {
  let ids =
    flow.staffId === "any" ? db.staff.filter((x) => x.active).map((x) => x.id) : [flow.staffId];
  let free = new Set(options.map((o) => o.time));
  let now = new Date().getHours() * 60 + new Date().getMinutes();
  return [
    ...new Set(
      db.bookings
        .filter((b) => b.date === d && b.status !== "cancelado" && ids.includes(b.staffId))
        .map((b) => b.time),
    ),
  ].filter((t) => !free.has(t) && (d !== today || minutes(t) > now));
}
async function confirmBooking() {
  let customer = flow.customer.trim(),
    phone = flow.phone.trim();
  if (customer.length < 3 || phone.replace(/\D/g, "").length < 10)
    return toast("Informe nome e telefone válidos.");
  if (!openSlots(flow.date, flow.confirmStaff, flow.serviceIds).includes(flow.time))
    return toast("Este horário ficou indisponível. Escolha outro.");
  $("#overlay").innerHTML =
    `<div class="confirm-layer"><div class="confirm-card" role="status" aria-live="polite"><div class="spinner"></div><h2>Estamos confirmando seu pedido</h2><p class="muted">Verificando a disponibilidade e reservando seu horário...</p></div></div>`;
  try {
    const result = await request("/bookings", {
      method: "POST",
      body: JSON.stringify({
        date: flow.date,
        time: flow.time,
        customer,
        phone,
        serviceId: flow.serviceIds[0],
        serviceIds: flow.serviceIds,
        staffId: flow.confirmStaff,
      }),
    });
    db.bookings.push(result.booking);
    let s = svcTotal(flow.serviceIds);
    $("#overlay").innerHTML =
      `<div class="confirm-layer"><div class="confirm-card" role="dialog" aria-modal="true"><div class="confirm-check">${ic("check", "ic-lg")}</div><h2>Seu pedido foi confirmado!</h2><p class="muted">${esc(customer)}, seu horário foi reservado com sucesso.</p><div class="summary-box"><strong>${esc(s?.name)} · ${money(s?.price)}</strong><span>${ic("calendar")} ${pretty(flow.date)} às ${flow.time}</span><span>${ic("scissors")} Profissional: ${esc(staff(flow.confirmStaff)?.name)}</span><span>Pagamento diretamente na barbearia.</span></div><button class="btn primary" style="width:100%" onclick="closeModal();flow={serviceIds:[]};step=1;go('public')">Concluir e voltar ao início ${ic("arrowRight")}</button></div></div>`;
  } catch (e) {
    closeModal();
    toast(e.message);
    await refreshState();
    step = 3;
    render();
  }
}
function adminPage() {
  let menu = [
    ["overview", "layout", "Visão geral"],
    ["agenda", "calendar", "Agenda"],
    ["bookings", "list", "Agendamentos"],
    ["clients", "users", "Clientes"],
    ["finance", "wallet", "Financeiro"],
    ["services", "scissors", "Serviços"],
    ["staff", "userCog", "Profissionais"],
    ["hours", "clock", "Horários da semana"],
    ["notices", "flag", "Avisos e bloqueios"],
    ["settings", "settings", "Configurações"],
  ];
  return `<div class="admin ${sideCollapsed ? "side-collapsed" : ""}"><aside class="sidebar"><div class="side-top"><div class="side-label">PAINEL DE CONTROLE</div><button class="side-toggle" onclick="toggleSide()" aria-label="${sideCollapsed ? "Expandir menu" : "Recolher menu"}" title="${sideCollapsed ? "Expandir menu" : "Recolher menu"}">${ic(sideCollapsed ? "chevRight" : "chevLeft")}</button></div><div class="side-menu">${menu.map((m) => `<button class="side-btn ${section === m[0] ? "active" : ""}" onclick="section='${m[0]}';render()" title="${m[2]}"><span class="side-ic">${ic(m[1])}</span><span class="side-txt">${m[2]}</span></button>`).join("")}</div><div class="side-foot"><button class="side-btn" onclick="toggleTheme()" title="${theme === "light" ? "Modo escuro" : "Modo claro"}"><span class="side-ic">${ic(theme === "light" ? "moon" : "sun")}</span><span class="side-txt">${theme === "light" ? "Modo escuro" : "Modo claro"}</span></button><button class="side-btn" onclick="go('public')" title="Site do cliente"><span class="side-ic">${ic("arrowRight")}</span><span class="side-txt">Site do cliente</span></button><button class="side-btn side-exit" onclick="logout()" title="Sair da gestão"><span class="side-ic">${ic("ban")}</span><span class="side-txt">Sair da gestão</span></button></div></aside><main class="main">${adminContent()}</main></div>`;
}
function pageHead(title, subtitle, extra = "") {
  return `<div class="page-head"><div><div class="eyebrow">PAINEL DA BARBEARIA</div><h1>${title}</h1><span class="muted">${subtitle}</span></div><div class="head-actions">${extra}</div></div>`;
}
function bookingsTable(rows, action = true) {
  return `<div class="tablewrap"><table class="table"><thead><tr><th>Data / hora</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Valor</th><th>Status</th>${action ? "<th></th>" : ""}</tr></thead><tbody>${rows.length ? rows.map((b) => `<tr><td>${new Date(b.date + "T12:00:00").toLocaleDateString("pt-BR")}<br><b>${b.time}</b></td><td>${esc(b.customer)}</td><td>${esc(svcTotal(b.serviceIds || b.serviceId)?.name || "Serviço removido")}</td><td>${esc(staff(b.staffId)?.name || "—")}</td><td class="price">${money(svcTotal(b.serviceIds || b.serviceId)?.price)}</td><td><span class="status ${b.status}">${{ pendente: "Pendente", confirmado: "Confirmado", concluido: "Concluído", cancelado: "Cancelado" }[b.status] || esc(b.status)}</span></td>${action ? `<td><button class="btn small ghost" onclick="bookingDetails('${b.id}')">Detalhes</button></td>` : ""}</tr>`).join("") : `<tr><td colspan="7" class="empty">Nenhum agendamento encontrado.</td></tr>`}</tbody></table></div>`;
}
const activeBookings = () => db.bookings.filter((b) => b.status !== "cancelado");
const totalPaid = () =>
  db.bookings
    .filter((b) => b.paid)
    .reduce((a, b) => a + (svcTotal(b.serviceIds || b.serviceId)?.price || 0), 0);
let selectedHoursStaff = null,
  expandedHoursDay = null;
function hoursPage() {
  const person = db.staff.find((p) => p.id === selectedHoursStaff) || db.staff[0];
  if (!person)
    return pageHead(
      "Horários da semana",
      "Cadastre um profissional antes de configurar o expediente.",
    );
  selectedHoursStaff = person.id;
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const spec = (i) =>
    person.weekly?.[i] || {
      mode: person.days.includes(i) ? "default" : "closed",
      start: person.start,
      end: person.end,
    };
  const open = days.map((_, i) => spec(i)).filter((v) => v.mode !== "closed").length;
  const custom = days.map((_, i) => spec(i)).filter((v) => v.mode === "custom").length;
  return `${pageHead("Horários da semana", "Organize o expediente de cada barbeiro. As mudanças atualizam os horários disponíveis no site.")}<div class="schedule-layout">
 <section class="schedule-main">
  <div class="schedule-panel"><div class="schedule-heading"><div><span class="schedule-kicker">01 · SELECIONE O PROFISSIONAL</span><h3>De quem é esta agenda?</h3></div><span class="schedule-subtle">${db.staff.length} profissionais</span></div><div class="schedule-persons">${db.staff.map((p) => `<button class="schedule-person ${p.id === person.id ? "current" : ""}" onclick="selectedHoursStaff='${p.id}';expandedHoursDay=null;render()"><span class="schedule-person-avatar">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.replaceWith(document.createTextNode('${esc(p.name.slice(0, 1))}'))">` : esc(p.name.slice(0, 1))}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.role)}</small></span><span class="schedule-person-check">${p.id === person.id ? ic("check") : ""}</span></button>`).join("")}</div></div>
  <div class="schedule-panel"><div class="schedule-heading"><div><span class="schedule-kicker">02 · EXPEDIENTE BASE</span><h3>Horário padrão</h3><p class="muted" style="margin:5px 0 0">Usado nos dias marcados como Padrão.</p></div><button class="btn small ghost" onclick="editStaff('${person.id}')">Editar padrão ${ic("pencil")}</button></div><div class="base-hours"><div class="base-time"><span>Entrada</span><strong>${person.start}</strong></div><span class="base-arrow">${ic("arrowRight")}</span><div class="base-time"><span>Saída</span><strong>${person.end}</strong></div><div class="base-copy"><strong>Configuração rápida</strong><small>Aplicar o expediente padrão de segunda a sábado, mantendo o domingo fechado.</small><button class="btn small" onclick="applyBaseWeek('${person.id}')">${ic("refresh")} Aplicar à semana</button></div></div></div>
  <div class="schedule-panel"><div class="schedule-heading"><div><span class="schedule-kicker">03 · PERSONALIZE A SEMANA</span><h3>Dias de atendimento</h3><p class="muted" style="margin:5px 0 0">Altere somente os dias que forem diferentes.</p></div><span class="chip">${open} dias ativos</span></div><div class="schedule-days">${days
    .map((name, i) => {
      const v = spec(i),
        isOpen = v.mode !== "closed",
        expand = expandedHoursDay === i;
      return `<div class="schedule-day ${isOpen ? "" : "is-off"} ${expand ? "expanded" : ""}"><div class="schedule-day-main"><div class="schedule-day-label"><span class="schedule-day-icon">${isOpen ? ic("dotFill") : ic("dot")}</span><span><strong>${name}</strong><small>${isOpen ? (v.mode === "custom" ? "Horário personalizado" : "Horário padrão") : "Sem atendimento"}</small></span></div><div class="schedule-day-time">${isOpen ? `${v.mode === "custom" ? v.start : person.start} <span>até</span> ${v.mode === "custom" ? v.end : person.end}` : "Fechado"}</div><div class="schedule-day-actions"><label class="switch" title="${isOpen ? "Fechar" : "Abrir"} ${name}"><input type="checkbox" aria-label="Atendimento na ${name}" ${isOpen ? "checked" : ""} onchange="toggleHoursDay('${person.id}',${i},this.checked)"><span class="switch-track"></span></label><button class="schedule-edit" ${isOpen ? "" : "disabled"} onclick="expandedHoursDay=${expand ? "null" : i};render()">${expand ? "Concluir" : "Ajustar"} <span>${expand ? ic("chevUp") : ic("chevDown")}</span></button></div></div>${expand && isOpen ? `<div class="schedule-expand"><p>Como será o expediente de ${name.toLowerCase()}?</p><div class="schedule-mode"><button class="${v.mode === "default" ? "active" : ""}" onclick="updateWeek('${person.id}',${i},'mode','default');expandedHoursDay=${i};render()">${ic("check")} Usar padrão</button><button class="${v.mode === "custom" ? "active" : ""}" onclick="updateWeek('${person.id}',${i},'mode','custom');expandedHoursDay=${i};render()">${ic("clock")} Personalizar</button></div>${v.mode === "custom" ? `<div class="schedule-times"><label>Das <input type="time" value="${v.start || person.start}" onchange="updateWeek('${person.id}',${i},'start',this.value);expandedHoursDay=${i};render()"></label><label>Até <input type="time" value="${v.end || person.end}" onchange="updateWeek('${person.id}',${i},'end',this.value);expandedHoursDay=${i};render()"></label></div>` : `<div class="schedule-tip">Aplica automaticamente o horário de ${person.start} às ${person.end}.</div>`}</div>` : ""}</div>`;
    })
    .join(
      "",
    )}</div><div class="schedule-save-note">${ic("check")} Alterações salvas automaticamente e refletidas no agendamento do cliente.</div></div>
 </section><aside class="schedule-aside"><div class="schedule-side-card"><span class="schedule-kicker">VISÃO GERAL</span><h3>Resumo da agenda</h3><div class="schedule-summary-person">${avatarOf(person)}<div><strong>${esc(person.name)}</strong><small>${esc(person.role)}</small></div></div><div class="schedule-metrics"><div><strong>${open}<small>/7</small></strong><span>dias abertos</span></div><div><strong>${custom}</strong><span>personalizados</span></div></div><div class="schedule-mini-week">${days.map((d, i) => `<div><span>${d.slice(0, 3)}</span><i class="${spec(i).mode === "closed" ? "closed" : spec(i).mode === "custom" ? "custom" : "normal"}"></i></div>`).join("")}</div><div class="schedule-key"><span><i class="normal"></i> Padrão</span><span><i class="custom"></i> Personalizado</span><span><i class="closed"></i> Fechado</span></div></div><div class="schedule-side-card schedule-help"><strong>Como funciona?</strong><p>Horário padrão é a rotina habitual. Use <b>Ajustar</b> para mudar apenas um dia, ou desligue a chave quando não houver expediente.</p><p>Feriados, férias e fechamentos em datas específicas devem ser configurados em <b>Avisos e bloqueios</b>.</p><button class="btn small ghost" onclick="section='notices';render()">Ver avisos e bloqueios ${ic("arrowRight")}</button></div></aside></div>`;
}
function toggleHoursDay(id, day, isOpen) {
  const p = staff(id);
  if (!p) return;
  const v = p.weekly?.[day];
  updateWeek(id, day, "mode", isOpen ? (v?.mode === "custom" ? "custom" : "default") : "closed");
}
function applyBaseWeek(id) {
  if (
    !confirm(
      "Aplicar horário padrão de segunda a sábado e fechar domingo? Horários personalizados desta semana serão substituídos.",
    )
  )
    return;
  const p = staff(id);
  p.weekly = {};
  for (let i = 0; i < 7; i++)
    p.weekly[i] = { mode: i === 0 ? "closed" : "default", start: p.start, end: p.end };
  p.days = [1, 2, 3, 4, 5, 6];
  expandedHoursDay = null;
  save();
  render();
  toast("Semana atualizada!");
}
function adminContent() {
  if (section === "overview") {
    const todayB = activeBookings()
      .filter((b) => b.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
    const upcoming = activeBookings()
      .filter(
        (b) =>
          b.date >= today && (b.date > today || b.time >= new Date().toTimeString().slice(0, 5)),
      )
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 5);
    const paidToday = db.bookings
      .filter((b) => b.paid && b.date === today)
      .reduce((a, b) => a + (svcTotal(b.serviceIds || b.serviceId)?.price || 0), 0);
    const completed = todayB.filter((b) => b.status === "concluido").length;
    const pending = todayB.filter(
      (b) => b.status === "pendente" || b.status === "confirmado",
    ).length;
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    const amounts = days.map((d) =>
      db.bookings
        .filter((b) => b.paid && b.date === d)
        .reduce((a, b) => a + (svcTotal(b.serviceIds || b.serviceId)?.price || 0), 0),
    );
    const maximum = Math.max(100, ...amounts);
    const weekTotal = amounts.reduce((a, v) => a + v, 0);
    return `<div class="premium-overview">${pageHead("Visão Geral", "O essencial da sua barbearia, em um só lugar.", `<button class="btn primary" onclick="openBookingModal()">${ic("plus")} Novo agendamento</button>`)}
 <div class="overview-kpis"><div class="ov-kpi highlight"><span class="kpi-icon">${ic("calendar")}</span><div><strong>${todayB.length}</strong><span>Atendimentos hoje</span></div></div><div class="ov-kpi"><span class="kpi-icon green">${ic("checkCircle")}</span><div><strong>${completed}</strong><span>Concluídos</span></div></div><div class="ov-kpi"><span class="kpi-icon">${ic("hourglass")}</span><div><strong>${pending}</strong><span>Aguardando</span></div></div><div class="ov-kpi highlight"><span class="kpi-icon">${ic("wallet")}</span><div><strong>${money(paidToday)}</strong><span>Recebidos hoje</span></div></div></div>
 <div class="ov-columns"><section class="ov-panel"><div class="ov-panel-head"><h2>${ic("calendar")} Próximos atendimentos</h2><button class="text-action" onclick="section='agenda';render()">Ver agenda completa ${ic("arrowRight")}</button></div><div class="next-list">${upcoming.length ? upcoming.map((b) => `<button class="next-booking" onclick="bookingDetails('${b.id}')"><b class="next-time">${b.time}</b><span class="next-name"><strong>${esc(b.customer)}</strong><small>${esc(svcTotal(b.serviceIds || b.serviceId)?.name || "Serviço")} · ${b.date === today ? "Hoje" : pretty(b.date)}</small></span><span class="next-staff">${ic("user")} ${esc(staff(b.staffId)?.name.split(" ")[0] || "—")}</span><span class="status ${b.status}">${b.status === "concluido" ? "Concluído" : b.status === "confirmado" ? "Confirmado" : b.status === "pendente" ? "Pendente" : b.status}</span></button>`).join("") : '<p class="empty">Nenhum próximo atendimento encontrado.</p>'}</div></section>
 <section class="ov-panel"><div class="ov-panel-head"><h2>${ic("chart")} Faturamento da semana</h2></div><div class="ov-chart">${amounts.map((a, i) => `<div class="ov-bar-col" title="${money(a)}"><div class="ov-bar" style="height:${Math.max(3, (100 * a) / maximum)}%"></div><small>${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][new Date(days[i] + "T12:00:00").getDay()]}</small></div>`).join("")}</div><div class="ov-bottom"><span><small>Total da semana</small><strong>${money(weekTotal)}</strong></span><button class="text-action" onclick="section='finance';render()">Ver financeiro ${ic("arrowRight")}</button></div></section></div>
 <div class="ov-shortcuts"><strong>Acesso rápido</strong><button class="btn primary" onclick="openBookingModal()">${ic("plus")} Novo agendamento</button><button class="btn" onclick="section='notices';render()">${ic("ban")} Bloquear horário</button><button class="btn" onclick="section='bookings';render()">${ic("receipt")} Registrar pagamento</button></div></div>`;
  }
  if (section === "agenda") {
    const employees = db.staff.filter((p) => p.active);
    const daybook = activeBookings().filter((b) => b.date === date);
    const isBooked = (b) =>
      b.status === "concluido" ? "done" : b.status === "pendente" ? "pending" : "scheduled";
    const times = Array.from({ length: 25 }, (_, i) => clock(8 * 60 + i * 30));
    const count = daybook.length;
    const possible = employees.reduce(
      (n, p) =>
        n +
        (staffHours(p, date).mode === "closed" || closed(date, p)
          ? 0
          : Math.max(
              0,
              Math.floor(
                (minutes(staffHours(p, date).mode === "custom" ? staffHours(p, date).end : p.end) -
                  minutes(
                    staffHours(p, date).mode === "custom" ? staffHours(p, date).start : p.start,
                  )) /
                  30,
              ),
            )),
      0,
    );
    return `<div class="premium-agenda">${pageHead("Agenda", "Visualize atendimentos por horário e profissional.", `<button class="btn ghost" onclick="date=today;render()">Hoje</button><button class="btn primary" onclick="openBookingModal()">${ic("plus")} Novo agendamento</button>`)}
 <div class="agenda-controls"><div class="day-nav"><button class="btn small" onclick="date=addDays(date,-1);render()">${ic("chevLeft")}</button><input type="date" value="${date}" aria-label="Selecionar data" onchange="if(this.value){date=this.value;render()}"><select aria-label="Mês" onchange="date=setYM(date,null,+this.value);render()">${["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => `<option value="${i}" ${+date.slice(5, 7) - 1 === i ? "selected" : ""}>${m}</option>`).join("")}</select><select aria-label="Ano" onchange="date=setYM(date,+this.value,null);render()">${(() => {
   const y = +today.slice(0, 4),
     c = +date.slice(0, 4);
   return [...new Set([y - 1, y, y + 1, y + 2, y + 3, c])]
     .sort()
     .map((v) => `<option ${v === c ? "selected" : ""}>${v}</option>`)
     .join("");
 })()}</select><button class="btn small" onclick="date=addDays(date,1);render()">${ic("chevRight")}</button></div><span class="muted">Arraste horizontalmente para visualizar outros profissionais ${ic("arrowRight")}</span></div>
 ${db.notices
   .filter((n) => n.date === date)
   .map(
     (n) =>
       `<div class="notice"><strong>${ic("flag")} ${esc(n.title)}</strong>${esc(n.detail)}</div>`,
   )
   .join("")}
 <section class="agenda-sheet"><div class="agenda-sheet-top"><h2>${ic("calendar")} ${pretty(date)}</h2><div class="agenda-sheet-metrics"><span>${ic("clock")} <b>${count}</b> agendamentos</span><span>${ic("trending")} <b>${Math.round(possible ? (count / possible) * 100 : 0)}%</b> ocupação estimada</span></div></div><div class="agenda-scroll"><div class="agenda-timeline" style="--professionals:${employees.length}"><div class="timeline-corner">Horário</div>${employees.map((p) => `<div class="timeline-person">${avatarOf(p)}<span><b>${esc(p.name)}</b><small>${esc(p.role || "Barbeiro")}</small></span></div>`).join("")}${times
   .map(
     (t) =>
       `<div class="timeline-hour">${t}</div>${employees
         .map((p) => {
           let match = daybook.find((b) => b.staffId === p.id && b.time === t);
           let block = closed(date, p.id) || staffHours(p, date).mode === "closed";
           return `<div class="timeline-cell" ${!match && !block ? `onclick="openBookingModal('${date}','${t}','${p.id}')" title="Novo agendamento"` : ""}>${match ? `<button class="timeline-booking ${isBooked(match)}" onclick="event.stopPropagation();bookingDetails('${match.id}')"><span class="book-main"><b>${esc(svcTotal(match.serviceIds || match.serviceId)?.name || "Atendimento")}</b><strong>${money(svcTotal(match.serviceIds || match.serviceId)?.price || 0)}</strong></span><span class="book-sub">${esc(match.customer)} · ${t}</span><span class="book-status">${match.status === "concluido" ? `${ic("check")} Concluído` : match.status === "pendente" ? `${ic("clock")} Pendente` : `${ic("calendar")} Confirmado`}</span></button>` : block ? '<span class="timeline-closed">Fechado</span>' : ""}</div>`;
         })
         .join("")}`,
   )
   .join(
     "",
   )}</div></div></section><p class="muted" style="margin-top:12px">Clique em um agendamento para visualizar, editar ou cancelar. Clique em um horário vazio para adicionar um cliente.</p></div>`;
  }
  if (section === "bookings") {
    return `${pageHead("Agendamentos", "Gerencie confirmações, cancelamentos e serviços.", `<button class="btn primary" onclick="openBookingModal()">+ Novo agendamento</button>`)}${(() => {
      let rows = [...db.bookings]
        .filter(
          (b) =>
            (!bf.date || b.date === bf.date) &&
            (!bf.service || (b.serviceIds || [b.serviceId]).includes(bf.service)) &&
            (!bf.staff || b.staffId === bf.staff) &&
            (!bf.status || b.status === bf.status) &&
            (!bf.name || norm(b.customer).includes(norm(bf.name))),
        )
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
      let active = Object.values(bf).some(Boolean);
      return `<form class="card filter-bar" onsubmit="event.preventDefault();applyBookingFilter()"><label>Data<input type="date" id="bfDate" onchange="applyBookingFilter()" value="${bf.date}"></label><label>Serviço<select id="bfService" onchange="applyBookingFilter()"><option value="">Todos</option>${db.services.map((x) => `<option value="${x.id}" ${bf.service === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label><label>Profissional<select id="bfStaff" onchange="applyBookingFilter()"><option value="">Todos</option>${db.staff.map((x) => `<option value="${x.id}" ${bf.staff === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label><label>Status<select id="bfStatus" onchange="applyBookingFilter()"><option value="">Todos</option>${[
        ["pendente", "Pendente"],
        ["confirmado", "Confirmado"],
        ["concluido", "Concluído"],
        ["cancelado", "Cancelado"],
      ]
        .map(([v, l]) => `<option value="${v}" ${bf.status === v ? "selected" : ""}>${l}</option>`)
        .join(
          "",
        )}</select></label><label>Cliente<input id="bfName" oninput="typeFilter(applyBookingFilter,'bfName')" placeholder="Nome do cliente" value="${esc(bf.name)}"></label><div class="filter-actions">${active ? `<button class="btn ghost" type="button" onclick="bf={date:'',service:'',staff:'',name:'',status:''};render()">Limpar</button>` : ""}</div></form><p class="muted filter-count">${rows.length} agendamento(s) encontrado(s)${active ? " com os filtros aplicados" : ""}.</p><div class="card">${bookingsTable(rows)}</div>`;
    })()}`;
  }
  if (section === "clients") {
    let map = {};
    db.bookings
      .filter((b) => !cf.staff || b.staffId === cf.staff)
      .forEach((b) => {
        let key = b.customer.trim().toLowerCase();
        if (!map[key])
          map[key] = { name: b.customer, phone: b.phone || "—", count: 0, spent: 0, last: "" };
        map[key].count++;
        map[key].spent += b.paid ? svcTotal(b.serviceIds || b.serviceId)?.price || 0 : 0;
        if (b.date > map[key].last) map[key].last = b.date;
      });
    let list = Object.values(map)
      .filter(
        (c) =>
          !cf.name ||
          norm(c.name).includes(norm(cf.name)) ||
          String(c.phone)
            .replace(/\D/g, "")
            .includes(cf.name.replace(/\D/g, "") || "#"),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    return `${pageHead("Clientes", "Histórico e relacionamento com seus clientes.")}<form class="card filter-bar" onsubmit="event.preventDefault();applyClientFilter()"><label>Cliente<input id="cfName" oninput="typeFilter(applyClientFilter,'cfName')" placeholder="Nome ou telefone" value="${esc(cf.name)}"></label><label>Atendido por<select id="cfStaff" onchange="applyClientFilter()"><option value="">Todos</option>${db.staff.map((x) => `<option value="${x.id}" ${cf.staff === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label><div class="filter-actions">${cf.name || cf.staff ? `<button class="btn ghost" type="button" onclick="cf={name:'',staff:''};render()">Limpar</button>` : ""}</div></form><p class="muted filter-count">${list.length} cliente(s) encontrado(s).</p><div class="card"><div class="tablewrap"><table class="table"><tr><th>Nome</th><th>Telefone</th><th>Agendamentos</th><th>Total pago</th><th>Última visita marcada</th></tr>${list.length ? "" : '<tr><td colspan="5" class="empty">Nenhum cliente encontrado.</td></tr>'}${list.map((c) => `<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${c.count}</td><td>${money(c.spent)}</td><td>${pretty(c.last)}</td></tr>`).join("")}</table></div></div>`;
  }
  if (section === "finance") {
    let paid = db.bookings.filter((b) => b.paid),
      notPaid = activeBookings().filter((b) => !b.paid),
      last7 = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    let counts = last7.map((d) =>
      paid
        .filter((b) => b.date === d)
        .reduce((a, b) => a + (svcTotal(b.serviceIds || b.serviceId)?.price || 0), 0),
    );
    let max = Math.max(1, ...counts);
    return `${pageHead("Financeiro", "Receitas recebidas, pendentes e formas de pagamento.", `<button class="btn primary" onclick="exportFinance()">${ic("download")} Exportar para Excel (CSV)</button><button class="btn" onclick="importFinance()">${ic("upload")} Importar CSV</button>`)}<div class="stats"><div class="stat"><small>Recebido</small><strong>${money(totalPaid())}</strong><span>Pagamentos confirmados</span></div><div class="stat"><small>A receber</small><strong>${money(notPaid.reduce((a, b) => a + (svcTotal(b.serviceIds || b.serviceId)?.price || 0), 0))}</strong><span>Agendamentos ativos</span></div><div class="stat"><small>Serviços pagos</small><strong>${paid.length}</strong><span>Atendimentos registrados</span></div><div class="stat"><small>Ticket médio</small><strong>${money(paid.length ? totalPaid() / paid.length : 0)}</strong><span>Por atendimento pago</span></div></div><div class="two-cols"><div class="card"><h3>Entradas — últimos 7 dias</h3><div class="bar-chart">${counts.map((v, i) => `<div class="bar" title="${money(v)}" style="height:${Math.max(3, (170 * v) / max)}px"><span>${last7[i].slice(8)}</span></div>`).join("")}</div><p class="muted" style="margin-top:35px">Gráfico baseado nos pagamentos registrados no protótipo.</p></div><div class="card"><h3>Pagamentos recentes</h3>${
      paid.length
        ? paid
            .slice()
            .reverse()
            .map(
              (b) =>
                `<div class="manage-row"><div><strong>${esc(b.customer)}</strong><p>${pretty(b.date)} • ${esc(b.paymentMethod || "Pagamento")}</p></div><strong class="price">${money(svcTotal(b.serviceIds || b.serviceId)?.price)}</strong></div>`,
            )
            .join("")
        : '<div class="empty">Nenhum pagamento registrado. Marque um atendimento como pago na agenda ou nos detalhes.</div>'
    }</div></div>`;
  }
  if (section === "services")
    return `${pageHead("Serviços", "Edite o catálogo que aparece imediatamente no site público.", `<button class="btn primary" onclick="editService()">+ Adicionar serviço</button>`)}<div class="card">${db.services.map((s) => `<div class="manage-row"><div><strong>${svcIcon(s)} ${esc(s.name)}</strong><p>${s.duration} min • ${money(s.price)} • ${s.active ? "Visível no site" : "Oculto no site"}</p></div><button class="btn small" onclick="editService('${s.id}')">Editar</button></div>`).join("")}</div>`;
  if (section === "hours") return hoursPage();
  if (section === "staff")
    return `${pageHead("Profissionais", "Cadastre profissionais e o horário padrão. Ajuste cada dia em Horários da semana.", `<button class="btn primary" onclick="editStaff()">+ Novo profissional</button>`)}<div class="card">${db.staff.map((p) => `<div class="manage-row"><div style="display:flex;align-items:center;gap:12px">${avatarOf(p)}<div><strong>${esc(p.name)}</strong><p>${esc(p.role)} • ${p.start}–${p.end} • ${p.active ? "Ativo" : "Inativo"}</p><p>Dias: ${p.days.map((i) => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][i]).join(", ")}</p></div></div><button class="btn small" onclick="editStaff('${p.id}')">Editar</button></div>`).join("")}</div>`;
  if (section === "notices")
    return `${pageHead("Avisos e bloqueios", "Comunique indisponibilidades e impeça reservas quando necessário.", `<button class="btn primary" onclick="editNotice()">+ Criar aviso</button>`)}<div class="card"><p class="muted">Avisos informativos aparecem na seleção da data. Bloqueios também removem os horários disponíveis do profissional ou de toda a equipe.</p>${db.notices
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(
        (n) =>
          `<div class="notice-row"><div><strong>${esc(n.title)}</strong><p>${pretty(n.date)} • ${n.type === "block" ? "Bloqueia agenda" : "Somente informa"} • ${n.staffId === "all" ? "Todos os profissionais" : esc(staff(n.staffId)?.name)}</p><p>${esc(n.detail)}</p></div><div style="display:flex;gap:7px"><button class="btn small" onclick="editNotice('${n.id}')">Editar</button><button class="btn small danger" onclick="removeNotice('${n.id}')">Excluir</button></div></div>`,
      )
      .join("")}</div>`;
  if (section === "settings")
    return `${pageHead("Configurações", "Personalize informações exibidas no site da barbearia.")}<div class="card" style="max-width:680px"><div class="forms"><label>Nome comercial<input id="setName" value="${esc(db.shop.name)}"></label><label>Frase do destaque<input id="setTag" value="${esc(db.shop.tagline)}"></label><label>WhatsApp da barbearia<input id="setPhone" value="${esc(db.shop.whatsapp)}" placeholder="5579999999999"></label><label>Descrição / endereço<textarea id="setAddress" rows="3">${esc(db.shop.address)}</textarea></label><button class="btn primary" onclick="saveSettings()">Salvar alterações</button></div></div>`;
  return "";
}
window.__barberRemount = (v) => {
  view = v;
  if (v !== "admin") closeModal();
  render();
  window.scrollTo(0, 0);
};
function toggleSide() {
  sideCollapsed = !sideCollapsed;
  localStorage.setItem("barberSide", sideCollapsed ? "1" : "0");
  render();
}
function render() {
  {
    let want = view === "admin" ? "/login" : "/";
    if (location.pathname !== want && !location.hash.includes("type=recovery"))
      history.replaceState(null, "", want);
  }
  document.body.classList.toggle("theme-light", view === "admin" && !!token && theme === "light");
  document.title = `${db.shop.name} • ${view === "admin" ? "Gestão" : view === "booking" ? "Agendamento" : "Barbearia"}`;
  $("#app").innerHTML =
    header() +
    (view === "public"
      ? publicPage()
      : view === "admin"
        ? token
          ? adminPage()
          : loginPage()
        : bookingPage());
}
function toast(t) {
  $("#toastbox").innerHTML = `<div class="toast">${esc(t)}</div>`;
  setTimeout(() => ($("#toastbox").innerHTML = ""), 3000);
}
function modal(title, body) {
  $("#overlay").innerHTML =
    `<div class="modal-bg" onclick="closeModal()"><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><h2>${title}</h2><button class="btn small ghost" onclick="closeModal()" aria-label="Fechar">${ic("x")}</button></div>${body}</div></div>`;
}
function closeModal() {
  $("#overlay").innerHTML = "";
}
function editService(id) {
  let s = service(id) || { name: "", duration: 30, price: 40, icon: "scissors", active: true };
  modal(
    id ? "Editar serviço" : "Novo serviço",
    `<form class="forms" onsubmit="event.preventDefault();saveService('${id || ""}')"><label>Nome<input id="fName" required value="${esc(s.name)}"></label><div class="form-row"><label>Duração em minutos<input id="fDuration" type="number" min="10" step="10" required value="${s.duration}"></label><label>Valor (R$)<input id="fPrice" type="number" min="0" step="0.01" required value="${s.price}"></label></div><label>Ícone<select id="fIcon">${SVC_ICONS.map(([k, l]) => `<option value="${k}" ${svcKey(s) === k ? "selected" : ""}>${l}</option>`).join("")}</select></label><label class="toggle"><input id="fActive" type="checkbox" ${s.active ? "checked" : ""}> Serviço ativo e visível no site</label><button class="btn primary" type="submit">Salvar serviço</button></form>`,
  );
}
function saveService(id) {
  let data = {
    id: id || uid(),
    name: $("#fName").value.trim(),
    duration: +$("#fDuration").value,
    price: +$("#fPrice").value,
    icon: $("#fIcon").value || "scissors",
    active: $("#fActive").checked,
  };
  if (!data.name || data.duration < 10) return toast("Confira os dados do serviço.");
  if (id) Object.assign(service(id), data);
  else db.services.push(data);
  save();
  closeModal();
  render();
  toast("Serviço atualizado no site!");
}
function setYM(d, y, m) {
  let Y = y ?? +d.slice(0, 4),
    M = m ?? +d.slice(5, 7) - 1,
    D = Math.min(+d.slice(8, 10), new Date(Y, M + 1, 0).getDate());
  return `${Y}-${String(M + 1).padStart(2, "0")}-${String(D).padStart(2, "0")}`;
}
const isOwnerStaff = (p) => !!p && (p.owner || p.id === "p1");
function removeStaff(id) {
  const p = staff(id);
  if (!p || isOwnerStaff(p)) return toast("O cadastro do dono não pode ser removido.");
  if (activeBookings().some((b) => b.staffId === id && b.date >= today))
    return toast(
      "Este profissional tem agendamentos futuros. Cancele ou transfira antes de remover.",
    );
  if (!confirm(`Remover ${p.name}?`)) return;
  db.staff = db.staff.filter((x) => x.id !== id);
  save();
  closeModal();
  render();
  toast("Profissional removido.");
}
let staffPhotoDraft;
function pickStaffPhoto(input) {
  const f = input.files?.[0];
  if (!f) return;
  if (!f.type.startsWith("image/")) return toast("Escolha um arquivo de imagem.");
  const img = new Image();
  img.onload = () => {
    const max = 480,
      r = Math.min(1, max / Math.max(img.width, img.height)),
      c = document.createElement("canvas");
    c.width = Math.round(img.width * r);
    c.height = Math.round(img.height * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    staffPhotoDraft = c.toDataURL("image/jpeg", 0.82);
    URL.revokeObjectURL(img.src);
    $("#staffPhotoPreview").innerHTML = avatarOf({ name: "", photo: staffPhotoDraft });
  };
  img.onerror = () => toast("Não foi possível ler a imagem.");
  img.src = URL.createObjectURL(f);
}
function editStaff(id) {
  staffPhotoDraft = undefined;
  let p = staff(id) || {
    name: "",
    role: "Barbeiro",
    start: "09:00",
    end: "18:00",
    days: [1, 2, 3, 4, 5, 6],
    active: true,
  };
  modal(
    id ? "Editar profissional" : "Novo profissional",
    `<form class="forms" onsubmit="event.preventDefault();saveStaff('${id || ""}')"><div class="photo-field"><div id="staffPhotoPreview">${avatarOf(p)}</div><div><strong>Foto do profissional</strong><p class="muted">Opcional. Sem foto, aparece a inicial do nome.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn small" style="display:inline-flex;cursor:pointer">${ic("camera")} Escolher foto<input type="file" accept="image/*" hidden onchange="pickStaffPhoto(this)"></label><button type="button" class="btn small ghost" onclick="staffPhotoDraft='';$('#staffPhotoPreview').innerHTML=avatarOf({name:$('#fName').value||'?'})">${ic("trash")} Remover</button></div></div></div><label>Nome<input id="fName" required value="${esc(p.name)}"></label><label>Função<input id="fRole" value="${esc(p.role)}"></label><div class="form-row"><label>Início do expediente<input type="time" id="fStart" value="${p.start}"></label><label>Fim do expediente<input type="time" id="fEnd" value="${p.end}"></label></div><strong>Dias de atendimento</strong><div style="display:flex;gap:12px;flex-wrap:wrap">${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d, i) => `<label class="toggle"><input type="checkbox" class="weekday" value="${i}" ${p.days.includes(i) ? "checked" : ""}>${d}</label>`).join("")}</div><label class="toggle"><input id="fActive" type="checkbox" ${p.active ? "checked" : ""}> Profissional ativo</label><div class="form-actions"><button class="btn primary" type="submit">Salvar profissional</button>${id ? (isOwnerStaff(p) ? `<button type="button" class="btn danger" disabled title="Cadastro do dono não pode ser removido">${ic("trash")} Remover (dono)</button>` : `<button type="button" class="btn danger" onclick="removeStaff('${id}')">${ic("trash")} Remover profissional</button>`) : ""}</div></form>`,
  );
}
function saveStaff(id) {
  let data = {
    id: id || uid(),
    name: $("#fName").value.trim(),
    role: $("#fRole").value.trim(),
    start: $("#fStart").value,
    end: $("#fEnd").value,
    days: [...document.querySelectorAll(".weekday:checked")].map((x) => +x.value),
    active: $("#fActive").checked,
  };
  if (staffPhotoDraft !== undefined) data.photo = staffPhotoDraft;
  if (!data.name || minutes(data.start) >= minutes(data.end) || !data.days.length)
    return toast("Confira expediente e dias de atendimento.");
  if (id) {
    data.weekly = staff(id).weekly || {};
    Object.assign(staff(id), data);
  } else db.staff.push(data);
  save();
  closeModal();
  render();
  toast("Profissional atualizado!");
}
function updateWeek(id, day, key, value) {
  let p = staff(id);
  if (!p) return;
  p.weekly = p.weekly || {};
  let v = p.weekly[day] || {
    mode: p.days.includes(day) ? "default" : "closed",
    start: p.start,
    end: p.end,
  };
  let next = { ...v, [key]: value };
  if (next.mode === "custom" && minutes(next.start) >= minutes(next.end)) {
    toast("O horário final deve ser depois do inicial.");
    render();
    return;
  }
  p.weekly[day] = next;
  p.days = [0, 1, 2, 3, 4, 5, 6].filter(
    (i) => (p.weekly[i]?.mode || (p.days.includes(i) ? "default" : "closed")) !== "closed",
  );
  save();
  render();
  toast("Expediente atualizado no calendário!");
}
function editNotice(id) {
  let n = db.notices.find((x) => x.id === id) || {
    date: today,
    staffId: "all",
    type: "block",
    title: "",
    detail: "",
  };
  modal(
    id ? "Editar aviso" : "Novo aviso / bloqueio",
    `<form class="forms" onsubmit="event.preventDefault();saveNotice('${id || ""}')"><label>Data<input type="date" id="fDate" value="${n.date}" required></label><label>Título<input id="fTitle" value="${esc(n.title)}" placeholder="Ex.: Não haverá expediente" required></label><label>Mensagem ao cliente<textarea id="fDetail" rows="3">${esc(n.detail)}</textarea></label><label>Aplicar para<select id="fStaff"><option value="all">Barbearia inteira</option>${db.staff.map((p) => `<option value="${p.id}" ${n.staffId === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label><label>Tipo<select id="fType"><option value="block" ${n.type === "block" ? "selected" : ""}>Bloquear agendamentos na data</option><option value="info" ${n.type === "info" ? "selected" : ""}>Somente mostrar aviso (sem bloquear)</option></select></label><p class="muted">Bloqueios não cancelam automaticamente agendamentos já existentes; revise-os manualmente.</p><button class="btn primary" type="submit">Salvar aviso</button></form>`,
  );
}
function saveNotice(id) {
  let data = {
    id: id || uid(),
    date: $("#fDate").value,
    staffId: $("#fStaff").value,
    type: $("#fType").value,
    title: $("#fTitle").value.trim(),
    detail: $("#fDetail").value.trim(),
  };
  if (!data.title || !data.date) return toast("Preencha data e título.");
  if (id)
    Object.assign(
      db.notices.find((n) => n.id === id),
      data,
    );
  else db.notices.push(data);
  save();
  closeModal();
  render();
  toast("Aviso publicado no agendamento!");
}
function removeNotice(id) {
  if (!confirm("Excluir este aviso?")) return;
  db.notices = db.notices.filter((n) => n.id !== id);
  save();
  render();
  toast("Aviso excluído.");
}
function openBookingModal(d = date, t = "", p = "") {
  let staffOpts = db.staff.filter((x) => x.active);
  modal(
    "Agendamento manual",
    `<form class="forms" onsubmit="event.preventDefault();manualBooking()"><label>Nome do cliente<input id="mCustomer" required placeholder="Nome completo"></label><label>Telefone<input id="mPhone" placeholder="(79) 99999-9999"></label><div class="form-row"><label>Serviço<select id="mService">${db.services
      .filter((x) => x.active)
      .map((s) => `<option value="${s.id}">${esc(s.name)} • ${money(s.price)}</option>`)
      .join(
        "",
      )}</select></label><label>Profissional<select id="mStaff">${staffOpts.map((x) => `<option value="${x.id}" ${p === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label></div><div class="form-row"><label>Data<input type="date" id="mDate" value="${d}" required></label><label>Horário<input type="time" id="mTime" value="${t || "09:00"}" required></label></div><p class="muted">O sistema verifica jornada, avisos e conflitos antes de salvar.</p><button class="btn primary" type="submit">Criar agendamento</button></form>`,
  );
}
function manualBooking() {
  let b = {
    id: uid(),
    customer: $("#mCustomer").value.trim(),
    phone: $("#mPhone").value.trim(),
    date: $("#mDate").value,
    time: $("#mTime").value,
    serviceId: $("#mService").value,
    staffId: $("#mStaff").value,
    status: "confirmado",
    paid: false,
    paymentMethod: null,
  };
  if (!b.customer || !openSlots(b.date, b.staffId, b.serviceId).includes(b.time))
    return toast("Horário inválido ou indisponível. Use intervalos de 10 minutos.");
  db.bookings.push(b);
  save();
  closeModal();
  render();
  toast("Agendamento criado!");
}
function bookingDetails(id) {
  let b = db.bookings.find((x) => x.id === id);
  if (!b) return toast("Agendamento não encontrado");
  modal(
    "Detalhes do atendimento",
    `<div class="summary-box"><strong>${esc(b.customer)}</strong><span>${esc(b.phone || "Telefone não informado")}</span><span>${pretty(b.date)} às ${b.time}</span><span>${esc(svcTotal(b.serviceIds || b.serviceId)?.name || "Serviço")} • ${money(svcTotal(b.serviceIds || b.serviceId)?.price)}</span><span>Profissional: ${esc(staff(b.staffId)?.name || "—")}</span></div><div class="forms" style="margin-top:18px"><label>Status<select id="dStatus" onchange="if(this.value==='concluido')$('#dPaid').checked=true">${[
      ["pendente", "Pendente"],
      ["confirmado", "Confirmado"],
      ["concluido", "Concluído"],
      ["cancelado", "Cancelado"],
    ]
      .map(([x, l]) => `<option ${b.status === x ? "selected" : ""} value="${x}">${l}</option>`)
      .join(
        "",
      )}</select></label><label class="toggle"><input id="dPaid" type="checkbox" ${b.paid ? "checked" : ""}> Pagamento recebido</label><label>Forma de pagamento<select id="dMethod">${["Pix", "Dinheiro", "Cartão de crédito", "Cartão de débito"].map((x) => `<option ${b.paymentMethod === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><div class="form-row"><button class="btn primary" onclick="saveBookingDetails('${id}')">Salvar status</button><button class="btn" onclick="editBooking('${id}')">${ic("pencil")} Editar agendamento</button></div><button class="btn danger" onclick="cancelBooking('${id}')">Cancelar agendamento</button></div>`,
  );
}
function saveBookingDetails(id) {
  let b = db.bookings.find((x) => x.id === id);
  if (!b) return;
  b.status = $("#dStatus").value;
  b.paid = $("#dPaid").checked;
  b.paymentMethod = b.paid ? $("#dMethod").value : null;
  save();
  closeModal();
  render();
  toast("Atendimento atualizado!");
}
function cancelBooking(id) {
  let b = db.bookings.find((x) => x.id === id);
  if (
    !b ||
    !confirm(
      `Cancelar o agendamento de ${b.customer}? O horário ficará disponível para novas reservas.`,
    )
  )
    return;
  b.status = "cancelado";
  save();
  closeModal();
  render();
  toast("Agendamento cancelado. Histórico preservado.");
}
function editBooking(id) {
  let b = db.bookings.find((x) => x.id === id);
  if (!b) return;
  modal(
    "Editar agendamento",
    `<form class="forms" onsubmit="event.preventDefault();saveEditedBooking('${id}')"><label>Cliente<input id="editCustomer" value="${esc(b.customer)}" required></label><label>Telefone<input id="editPhone" value="${esc(b.phone || "")}" required></label><div class="form-row"><label>Serviço<select id="editService">${db.services
      .filter((x) => x.active || x.id === b.serviceId)
      .map(
        (x) =>
          `<option value="${x.id}" ${x.id === b.serviceId ? "selected" : ""}>${esc(x.name)}</option>`,
      )
      .join("")}</select></label><label>Profissional<select id="editStaff">${db.staff
      .filter((x) => x.active || x.id === b.staffId)
      .map(
        (x) =>
          `<option value="${x.id}" ${x.id === b.staffId ? "selected" : ""}>${esc(x.name)}</option>`,
      )
      .join(
        "",
      )}</select></label></div><div class="form-row"><label>Data<input type="date" id="editDate" value="${b.date}" required></label><label>Horário<input type="time" id="editTime" value="${b.time}" required></label></div><p class="muted">A disponibilidade será verificada antes de salvar.</p><button class="btn primary" type="submit">Salvar alterações</button></form>`,
  );
}
function saveEditedBooking(id) {
  const b = db.bookings.find((x) => x.id === id);
  if (!b) return;
  const updated = {
    ...b,
    customer: $("#editCustomer").value.trim(),
    phone: $("#editPhone").value.trim(),
    date: $("#editDate").value,
    time: $("#editTime").value,
    serviceId: $("#editService").value,
    staffId: $("#editStaff").value,
  };
  if (updated.customer.length < 3) return toast("Informe o nome do cliente");
  if (updated.date < today) return toast("Selecione uma data válida");
  const p = staff(updated.staffId),
    srv = service(updated.serviceId);
  if (!p || !srv) return toast("Profissional ou serviço inválido");
  const a = minutes(updated.time),
    h = staffHours(p, updated.date);
  let start = h.mode === "custom" ? h.start : p.start,
    end = h.mode === "custom" ? h.end : p.end;
  if (
    h.mode === "closed" ||
    closed(updated.date, p) ||
    a < minutes(start) ||
    a + srv.duration > minutes(end)
  )
    return toast("Horário fora do expediente ou bloqueado");
  if (
    db.bookings.some(
      (x) =>
        x.id !== id &&
        x.status !== "cancelado" &&
        x.date === updated.date &&
        x.staffId === updated.staffId &&
        a < minutes(x.time) + bookDur(x) &&
        a + srv.duration > minutes(x.time),
    )
  )
    return toast("Existe outro atendimento nesse horário");
  Object.assign(b, updated);
  save();
  closeModal();
  render();
  toast("Agendamento editado!");
}
function exportFinance() {
  const cols = [
    "ID",
    "Data",
    "Hora",
    "Cliente",
    "Telefone",
    "Serviço",
    "Profissional",
    "Valor (R$)",
    "Status",
    "Pago",
    "Forma pagamento",
  ];
  const quote = (v) => '"' + String(v ?? "").replaceAll('"', '""') + '"';
  const rows = db.bookings.map((b) => [
    b.id,
    b.date,
    b.time,
    b.customer,
    b.phone,
    svcTotal(b.serviceIds || b.serviceId)?.name || "",
    staff(b.staffId)?.name || "",
    (svcTotal(b.serviceIds || b.serviceId)?.price || 0).toFixed(2).replace(".", ","),
    b.status,
    b.paid ? "Sim" : "Não",
    b.paymentMethod || "",
  ]);
  const csv = "\ufeff" + [cols, ...rows].map((row) => row.map(quote).join(";")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "barberflow-financeiro-" + today + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Planilha exportada. Abre no Excel.");
}
function importFinance() {
  modal(
    "Importar planilha",
    `<div class="forms"><p class="muted">Importe arquivos CSV exportados pelo BarberFlow. Para segurança, a importação oferece uma prévia antes de alterar dados.</p><label>Arquivo CSV<input type="file" id="financeFile" accept=".csv,text/csv"></label><button class="btn primary" onclick="previewFinanceImport()">Analisar arquivo</button></div>`,
  );
}
function previewFinanceImport() {
  const file = $("#financeFile")?.files?.[0];
  if (!file) return toast("Escolha um CSV.");
  if (file.size > 2_000_000) return toast("Arquivo excede 2 MB.");
  const reader = new FileReader();
  reader.onload = () => {
    let rows = String(reader.result)
      .replace(/^\ufeff/, "")
      .trim()
      .split(/\r?\n/);
    const header = rows.shift() || "";
    if (!header.includes("ID") || !header.includes("Cliente"))
      return toast("Arquivo incompatível com exportação do BarberFlow.");
    modal(
      "Prévia da importação",
      `<p>Arquivo reconhecido com ${rows.length} registro(s).</p><p class="notice">Importação de registros financeiros ainda exige conciliação manual para evitar duplicatas e modificações indevidas. Nenhum registro foi alterado.</p><button class="btn primary" onclick="closeModal()">Entendi</button>`,
    );
  };
  reader.readAsText(file, "utf-8");
}
function saveSettings() {
  db.shop = {
    ...db.shop,
    name: $("#setName").value.trim() || "Barbearia - Rafael Úzeda",
    tagline: $("#setTag").value.trim(),
    whatsapp: $("#setPhone").value.trim(),
    address: $("#setAddress").value.trim(),
  };
  save();
  render();
  toast("Informações atualizadas no site!");
}
function resetDemo() {
  if (!confirm("Restaurar todos os dados de exemplo?")) return;
  db = structuredClone(base);
  save();
  date = today;
  render();
  toast("Dados restaurados!");
}
for (const name of [
  "go",
  "startBooking",
  "chooseProfessional",
  "editService",
  "saveService",
  "editStaff",
  "saveStaff",
  "updateWeek",
  "editNotice",
  "saveNotice",
  "removeNotice",
  "openBookingModal",
  "manualBooking",
  "bookingDetails",
  "saveBookingDetails",
  "editBooking",
  "saveEditedBooking",
  "cancelBooking",
  "saveSettings",
  "resetDemo",
  "closeModal",
  "confirmBooking",
  "login",
  "logout",
  "render",
  "applyBaseWeek",
  "toggleHoursDay",
  "exportFinance",
  "importFinance",
  "previewFinanceImport",
]) {
  try {
    window[name] = eval(name);
  } catch {}
}
Object.defineProperty(window, "flow", {
  get: () => flow,
  set: (v) => {
    flow = v;
  },
});
Object.defineProperty(window, "step", {
  get: () => step,
  set: (v) => {
    step = v;
  },
});
Object.defineProperty(window, "section", {
  get: () => section,
  set: (v) => {
    section = v;
  },
});
Object.defineProperty(window, "selectedHoursStaff", {
  get: () => selectedHoursStaff,
  set: (v) => {
    selectedHoursStaff = v;
  },
});
Object.defineProperty(window, "expandedHoursDay", {
  get: () => expandedHoursDay,
  set: (v) => {
    expandedHoursDay = v;
  },
});
Object.defineProperty(window, "date", {
  get: () => date,
  set: (v) => {
    date = v;
  },
});
refreshState().catch((e) => {
  $("#app").innerHTML =
    `<main class="wrap section"><div class="card"><h2>Não foi possível conectar à API</h2><p class="muted">${esc(e.message)}. Tente novamente em instantes.</p><button class="btn primary" onclick="location.reload()">Tentar novamente</button></div></main>`;
});
