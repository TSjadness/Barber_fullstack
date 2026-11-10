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
const svcIcon = (s, c) => ic(svcKey(s), c);
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
/* ------------------------------------------------------------------
 * Atualização incremental do DOM
 * As telas são geradas como texto (template strings). Antes, cada clique
 * trocava o innerHTML inteiro: todos os elementos eram destruídos e
 * recriados, as animações de entrada recomeçavam do zero (o "flash"
 * escuro), imagens recarregavam e o foco/rolagem eram perdidos.
 * Agora o novo HTML é comparado com o DOM atual e só o que mudou é
 * alterado; elementos iguais permanecem intactos.
 * ------------------------------------------------------------------ */
const KEEP_CLASSES = /^(bf-enter|bf-page-enter|bf-mobile-open)$/;
function syncElement(cur, nxt) {
  for (const attr of [...cur.attributes])
    if (!nxt.hasAttribute(attr.name)) cur.removeAttribute(attr.name);
  for (const attr of nxt.attributes) {
    let value = attr.value;
    if (attr.name === "class") {
      // classes de animação/estado aplicadas por script não devem ser removidas pela comparação
      const keep = [...cur.classList].filter(
        (c) => KEEP_CLASSES.test(c) && !nxt.classList.contains(c),
      );
      if (keep.length) value = (value + " " + keep.join(" ")).trim();
    }
    if (cur.getAttribute(attr.name) !== value) cur.setAttribute(attr.name, value);
  }
  const tag = cur.nodeName;
  if (tag === "INPUT") {
    if (cur.type === "checkbox" || cur.type === "radio") cur.checked = nxt.hasAttribute("checked");
    else if (cur.type !== "file" && cur !== document.activeElement) {
      const value = nxt.getAttribute("value") ?? "";
      if (cur.value !== value) cur.value = value;
    }
  } else if (tag === "TEXTAREA" && cur !== document.activeElement) {
    if (cur.value !== nxt.textContent) cur.value = nxt.textContent;
  }
}
function morphChildren(cur, nxt) {
  const next = nxt.childNodes;
  for (let i = 0; i < next.length; i++) {
    const n = next[i],
      c = cur.childNodes[i];
    if (!c) {
      cur.appendChild(document.importNode(n, true));
      continue;
    }
    if (c.nodeType !== n.nodeType || c.nodeName !== n.nodeName) {
      cur.replaceChild(document.importNode(n, true), c);
      continue;
    }
    if (c.nodeType !== 1) {
      if (c.nodeValue !== n.nodeValue) c.nodeValue = n.nodeValue;
      continue;
    }
    syncElement(c, n);
    morphChildren(c, n);
    if (c.nodeName === "SELECT") {
      const index = [...n.querySelectorAll("option")].findIndex((o) => o.hasAttribute("selected"));
      c.selectedIndex = index >= 0 ? index : 0;
    }
  }
  while (cur.childNodes.length > next.length) cur.removeChild(cur.lastChild);
}
function morphHTML(container, html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  morphChildren(container, template.content);
}
/** Reinicia a animação de entrada de um elemento (somente em trocas reais de tela). */
function replayEnter(el, cls = "bf-enter") {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

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
    phone: "",
    instagram: "",
    facebook: "",
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
  closeMobileMenu();
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
  updateFilteredResults();
}
function liveFilter(fn, id) {
  fn();
}
let ftm;
function typeFilter(fn, id) {
  clearTimeout(ftm);
  ftm = setTimeout(() => liveFilter(fn, id), 250);
}
function applyClientFilter() {
  cf = { name: $("#cfName").value.trim(), staff: $("#cfStaff").value };
  updateFilteredResults();
}
const norm = (t) =>
  String(t || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function updateFilteredResults() {
  if (view !== "admin" || !["bookings", "clients"].includes(section)) return;
  const current = document.querySelector(".main .filter-count");
  if (!current) return;
  const source = document.createElement("div");
  source.innerHTML = adminContent();
  const next = source.querySelector(".filter-count");
  if (!next) return;
  const currentCard = current.nextElementSibling,
    nextCard = next.nextElementSibling;
  current.replaceWith(next);
  if (currentCard && nextCard) currentCard.replaceWith(nextCard);
  const clear = document.querySelector(".main .filter-clear");
  if (clear)
    clear.disabled =
      section === "bookings" ? !Object.values(bf).some(Boolean) : !(cf.name || cf.staff);
}
function clearBookingFilters() {
  bf = { date: "", service: "", staff: "", name: "", status: "" };
  ["bfDate", "bfService", "bfStaff", "bfName", "bfStatus"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  updateFilteredResults();
}
function clearClientFilters() {
  cf = { name: "", staff: "" };
  ["cfName", "cfStaff"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  updateFilteredResults();
}
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
/** Sessão recusada pelo servidor (401): volta ao site público em vez de ficar numa tela quebrada. */
async function handleSessionExpired() {
  token = "";
  view = "public";
  try {
    await request("/logout", { method: "POST" });
  } catch {}
  db = await request("/public");
  serverReady = true;
  render();
  // Adiado: um aviso disparado junto da troca de tela é descartado pela troca.
  setTimeout(() => toast("Sua sessão expirou. Entre novamente para continuar."), 300);
}
async function refreshState() {
  try {
    db = await request(token ? "/admin/state" : "/public");
  } catch (e) {
    if (token && e.status === 401) return handleSessionExpired();
    throw e;
  }
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
      if (e.status === 401) {
        try {
          await handleSessionExpired();
        } catch {}
        return;
      }
      toast(
        e.network
          ? "Sem conexão: não foi possível salvar. Tente novamente em instantes."
          : "Erro ao salvar: " + e.message,
      );
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
  closeMobileMenu();
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
  return `<header class="topbar ${view === "admin" && token ? "" : "topbar-public"}"><div class="brand" onclick="go('public')" style="cursor:pointer"><img class="brand-logo" src="/barber/assets/logo_rafael_uzeda.png" alt="Barbearia Rafael Úzeda"><span class="brand-name">RAFAEL <span style="color:var(--gold)">ÚZEDA</span><small>Barbearia</small></span></div><div class="top-actions"><button class="bf-mobile-menu-button" type="button" onclick="toggleMobileMenu()" aria-label="Abrir menu da gestão" aria-expanded="false" aria-controls="barber-sidebar"><span></span><span></span><span></span></button><button class="btn ghost only-desktop" onclick="go('public')">Site do cliente</button><button class="btn ${view === "admin" ? "primary" : "ghost"}" onclick="go('admin')">${ic("settings")} <span>Gestão</span></button><button class="btn ${view === "booking" ? "primary" : "ghost"}" onclick="newBooking()">${ic("calendarPlus")} <span>Agendar</span></button></div></header>`;
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
    )}</div></section><section class="wrap section essence" style="border-top:1px solid var(--line)"><div class="eyebrow">NOSSA ESSÊNCIA</div><h2>Uma pausa para você.</h2><p class="muted">${esc(db.shop.address)}</p><button class="btn primary essence-cta" onclick="newBooking()">Reservar um horário</button></section></main><footer class="site-footer"><div class="wrap foot-grid"><div class="foot-brand"><img src="/barber/assets/logo_rafael_uzeda.png" alt="Barbearia Rafael Úzeda"><p>${esc(db.shop.tagline)}</p></div><div><h4>Endereço</h4><p class="foot-line">${ic("mapPin")}<span>${esc(db.shop.address)}</span></p></div>${contactColumn()}<div><h4>Formas de pagamento</h4><p class="foot-line">${ic("banknote")}<span>Dinheiro</span></p><p class="foot-line">${ic("card")}<span>Cartão de crédito</span></p><p class="foot-line">${ic("card")}<span>Cartão de débito</span></p></div></div><div class="foot-bottom">© ${new Date().getFullYear()} ${esc(db.shop.name)}. Todos os direitos reservados.</div></footer>`;
}
function contactColumn() {
  const wa = phoneIntl(db.shop.whatsapp);
  const tel = phoneIntl(db.shop.phone || db.shop.whatsapp);
  const social = socialLinks();
  if (!wa && !tel && !social) return "";
  return `<div><h4>Contato</h4>${wa ? `<a class="foot-line" href="https://wa.me/${wa}" target="_blank" rel="noopener">${ic("whatsapp")}<span> ${esc(phonePretty(wa))}</span></a>` : ""}${tel ? `<a class="foot-line" href="tel:+${tel}">${ic("phone")}<span>${esc(phonePretty(tel))}</span></a>` : ""}${social}</div>`;
}
function go(v, s) {
  closeMobileMenu();
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
        return `<div class="choice ${on ? "selected" : ""}" role="checkbox" aria-checked="${on}" tabindex="0" onclick="toggleSvc('${s.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSvc('${s.id}')}"><div class="choice-main"><span class="choice-check">${on ? ic("check") : ""}</span><div><strong>${esc(s.name)}</strong><p>${ic("clock")} ${s.duration} minutos</p></div></div><strong class="price">${money(s.price)}</strong></div>`;
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
    let slots = options;
    body = `<h2>Data e horário</h2><p class="muted">Escolha um dia e veja os horários disponíveis.</p><div class="availability-legend"><span><i style="background:#51b77e"></i>Disponível</span><span><i style="background:#e8c15a"></i>Poucas vagas</span><span><i style="background:#db854b"></i>Lotado</span><span><i style="background:#d65b65"></i>Fechado</span></div><div class="booking-date-time"><div class="card booking-calendar"><h3>${d ? pretty(d) : "Selecione uma data"}</h3>${monthCalendar(d)}</div><div class="card booking-slots"><h3>Horários disponíveis</h3>${!d ? '<div class="times-empty">' + ic("calendar") + "<span>Por favor, escolha uma data para verificar os horários disponíveis.</span></div>" : `<div class="time-periods">${slots.length ? renderAvailableTimeGroups(slots) : '<div class="empty">Nenhum horário disponível para esta data. Escolha outro dia.</div>'}</div>`}</div></div>${alerts.map((n) => `<div class="notice"><strong>${ic("alert")} ${esc(n.title)}</strong>${esc(n.detail)}${n.type === "block" ? "<br><small>Horários indisponíveis para o profissional afetado.</small>" : ""}</div>`).join("")}`;
  }
  if (step === 4)
    body = `<h2>Finalizar agendamento</h2><p class="muted">Confira os dados e informe seu contato.</p><div class="summary-box"><strong>${esc(ss?.name)} · ${money(ss?.price)}</strong><span>${ic("clock")} ${ss?.duration} minutos</span><span>${ic("user")} ${esc(staff(flow.confirmStaff)?.name)}</span><span>${ic("calendar")} ${pretty(flow.date)} às ${flow.time}</span><span class="muted">Pagamento diretamente na barbearia.</span></div><div class="forms" style="margin-top:20px"><label>Seu nome completo<input id="clientName" placeholder="Ex.: João Silva" autocomplete="name" maxlength="100" value="${esc(flow.customer)}" oninput="formatClientName(this)"></label><label>Seu WhatsApp<input id="clientPhone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="15" placeholder="(79) 99999-9999" value="${esc(flow.phone)}" oninput="formatClientPhone(this)"></label></div>`;
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
function renderAvailableTimeGroups(slots) {
  const groups = [
    { name: "Manhã", test: (t) => minutes(t) < 12 * 60 },
    { name: "Tarde", test: (t) => minutes(t) >= 12 * 60 && minutes(t) < 18 * 60 },
    { name: "Noite", test: (t) => minutes(t) >= 18 * 60 },
  ];
  return groups
    .map((group) => {
      const available = slots.filter((slot) => group.test(slot.time));
      if (!available.length) return "";
      return `<section class="time-period" aria-label="Horários da ${group.name.toLowerCase()}"><h4 class="time-period-title">${group.name}</h4><div class="times">${available.map((t) => `<button type="button" class="time-button ${flow.time === t.time && flow.confirmStaff === t.staffId ? "selected" : ""}" aria-pressed="${flow.time === t.time && flow.confirmStaff === t.staffId}" onclick="selectBookingTime('${t.time}','${t.staffId}',this)">${t.time}${flow.staffId === "any" ? `<small>${esc(staff(t.staffId)?.name?.split(" ")[0] || "Profissional")}</small>` : ""}</button>`).join("")}</div></section>`;
    })
    .join("");
}
function selectBookingTime(time, staffId, button) {
  if (!button || button.disabled || bookingSubmitting) return;
  flow.time = time;
  flow.confirmStaff = staffId;
  document.querySelectorAll(".booking-slots .time-button").forEach((el) => {
    const selected = el === button;
    el.classList.toggle("selected", selected);
    el.setAttribute("aria-pressed", String(selected));
  });
  const next = document.querySelector(".booking-foot .btn.primary");
  if (next) next.disabled = false;
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
    .sort((a, b) => a.time.localeCompare(b.time));
}
function formatClientName(input) {
  const cursor = input.selectionStart;
  const original = input.value;
  const cleaned = original.replace(/[^\p{L}\p{M}\s'-]/gu, "").replace(/\s{2,}/g, " ");
  input.value = cleaned;
  flow.customer = cleaned;
  if (cursor != null && original !== cleaned)
    input.setSelectionRange(Math.min(cursor, cleaned.length), Math.min(cursor, cleaned.length));
}
function formatClientPhone(input) {
  let digits = input.value.replace(/\D/g, "").slice(0, 11);
  let formatted =
    digits.length > 2
      ? `(${digits.slice(0, 2)}) ${digits.slice(2, digits.length > 10 ? 7 : 6)}${digits.length > (digits.length > 10 ? 7 : 6) ? "-" + digits.slice(digits.length > 10 ? 7 : 6) : ""}`
      : digits.length > 0
        ? `(${digits}`
        : "";
  input.value = formatted;
  flow.phone = formatted;
}
const validClientName = (name) => {
  let parts = name.trim().split(/\s+/);
  return parts.length >= 2 && parts.every((p) => /^[\p{L}\p{M}'-]{2,}$/u.test(p));
};
let bookingSubmitting = false;
async function confirmBooking() {
  let customer = flow.customer.trim(),
    phone = flow.phone.trim();
  if (bookingSubmitting) return;
  if (!validClientName(customer)) return toast("Informe nome e sobrenome (somente letras).");
  if (!/^\d{10,11}$/.test(phone.replace(/\D/g, "")))
    return toast("Informe um WhatsApp válido com DDD.");
  if (!openSlots(flow.date, flow.confirmStaff, flow.serviceIds).includes(flow.time))
    return toast("Este horário ficou indisponível. Escolha outro.");
  bookingSubmitting = true;
  const startedAt = Date.now();
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
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, 1800 - (Date.now() - startedAt))),
    );
    $("#overlay").innerHTML =
      `<div class="confirm-layer"><div class="confirm-card" role="dialog" aria-modal="true"><div class="confirm-check">${ic("check", "ic-lg")}</div><h2>Seu pedido foi confirmado!</h2><p class="muted">${esc(customer)}, seu horário foi reservado com sucesso.</p><div class="summary-box"><strong>${esc(s?.name)} · ${money(s?.price)}</strong><span>${ic("calendar")} ${pretty(flow.date)} às ${flow.time}</span><span>${ic("scissors")} Profissional: ${esc(staff(flow.confirmStaff)?.name)}</span><span>Pagamento diretamente na barbearia.</span></div><button class="btn primary" style="width:100%" onclick="closeModal();flow={serviceIds:[]};step=1;go('public')">Concluir e voltar ao início ${ic("arrowRight")}</button></div></div>`;
  } catch (e) {
    closeModal();
    console.error("[BarberFlow] Falha na confirmação:", e);
    if (e.network || e.status >= 500 || !e.message) {
      toast("Não foi possível confirmar o agendamento. Confira sua conexão e tente novamente.");
    } else if (e.status === 409) {
      // Outra pessoa reservou o horário primeiro: mostra o motivo, atualiza a disponibilidade
      // e volta para a escolha de horário mantendo nome e WhatsApp já preenchidos.
      toast(e.message + " Escolha outro horário.");
      flow.time = null;
      step = 3;
      try {
        db = await request("/public");
      } catch {}
      render();
    } else {
      toast(e.message);
    }
  } finally {
    bookingSubmitting = false;
  }
}
/* ------------------------------------------------------------------
 * Calendário geral (todos os profissionais juntos)
 * ------------------------------------------------------------------ */
let adminCalMonth = today.slice(0, 7),
  calDay = today,
  calFull = false;
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const BOOKING_CLASS = { concluido: "done", pendente: "pending" };
const BOOKING_LABEL = { pendente: "Pendente", confirmado: "Confirmado", concluido: "Concluído" };
const phoneLabel = (raw) => {
  const d = String(raw || "").replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d || "Sem telefone";
};
/** Número com DDI 55 (ex.: 5579999999999) ou só com DDD, no formato (79) 99999-9999. */
const phonePretty = (raw) => {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("55")) d = d.slice(2);
  return phoneLabel(d);
};
/** Dígitos com DDI 55, prontos para wa.me e tel:. */
const phoneIntl = (raw) => {
  const d = String(raw || "").replace(/\D/g, "");
  return d.length === 10 || d.length === 11 ? "55" + d : d;
};
/** Link seguro da rede social: aceita @usuario, usuario ou URL http(s); qualquer outra coisa é ignorada. */
function socialUrl(kind, raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return "";
  if (/^(www\.|m\.)?(instagram|facebook|fb)\.com\//i.test(v)) return "https://" + v;
  const handle = v
    .replace(/^@/, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "");
  if (!handle) return "";
  return (kind === "instagram" ? "https://instagram.com/" : "https://facebook.com/") + handle;
}
function socialLinks() {
  const wa = phoneIntl(db.shop.whatsapp);
  const items = [
    ["whatsapp", "WhatsApp", wa ? "https://wa.me/" + wa : ""],
    ["instagram", "Instagram", socialUrl("instagram", db.shop.instagram)],
    ["facebook", "Facebook", socialUrl("facebook", db.shop.facebook)],
  ].filter((i) => i[2]);
  return items.length
    ? `<div class="foot-social">${items.map(([k, label, href]) => `<a class="foot-social-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}">${ic(k)}</a>`).join("")}</div>`
    : "";
}
function setAdminCal(year, monthIndex) {
  adminCalMonth = iso(new Date(+year, +monthIndex, 1)).slice(0, 7);
  render();
}
function shiftAdminCal(n) {
  const [y, m] = adminCalMonth.split("-").map(Number);
  setAdminCal(y, m - 1 + n);
}
function goCalToday() {
  adminCalMonth = today.slice(0, 7);
  calDay = today;
  render();
}
function selectCalDay(day) {
  calDay = day;
  adminCalMonth = day.slice(0, 7);
  render();
}
function setCalFull(on) {
  calFull = !!on;
  document.body.classList.toggle("bf-cal-lock", calFull);
  if (calFull) document.documentElement.requestFullscreen?.().catch(() => {});
  else if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  render();
}
const toggleCalFull = () => setCalFull(!calFull);
/** Fecha a tela cheia sem redesenhar (usado quando o usuário sai do Calendário). */
function dropCalFull() {
  calFull = false;
  document.body.classList.remove("bf-cal-lock");
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
}
// Saiu da tela cheia do navegador (Esc): fecha também o modo maximizado.
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && calFull) setCalFull(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || !calFull) return;
  if (document.querySelector(".modal-bg, .photo-zoom, .confirm-layer")) return;
  setCalFull(false);
});
function calendarPage() {
  const [y, m] = adminCalMonth.split("-").map(Number);
  const first = new Date(y, m - 1, 1),
    daysInMonth = new Date(y, m, 0).getDate();
  const byDay = {};
  for (const b of activeBookings()) (byDay[b.date] ||= []).push(b);
  for (const list of Object.values(byDay)) list.sort((a, b) => a.time.localeCompare(b.time));
  const monthCount = Object.entries(byDay)
    .filter(([d]) => d.startsWith(adminCalMonth))
    .reduce((n, [, list]) => n + list.length, 0);
  const serviceName = (b) => svcTotal(b.serviceIds || b.serviceId)?.name || "Serviço removido";
  const attendant = (b) => staff(b.staffId)?.name || "Sem profissional";
  const cls = (b) => BOOKING_CLASS[b.status] || "scheduled";
  const MAX_CHIPS = 2;

  const cells = Array.from(
    { length: first.getDay() },
    () => '<div class="bcal-day blank" aria-hidden="true"></div>',
  );
  for (let i = 1; i <= daysInMonth; i++) {
    const d = `${adminCalMonth}-${String(i).padStart(2, "0")}`,
      list = byDay[d] || [],
      notices = db.notices.filter((n) => n.date === d);
    const chips = list
      .slice(0, MAX_CHIPS)
      .map(
        (b) =>
          `<button type="button" class="bcal-event ${cls(b)}" onclick="bookingDetails('${b.id}')" title="${esc(`${b.time} · ${b.customer} · ${serviceName(b)} · ${phoneLabel(b.phone)} · ${attendant(b)}`)}"><span class="bcal-ev-line"><b class="bcal-ev-time">${b.time}</b><span class="bcal-ev-name">${esc(b.customer)}</span></span><span class="bcal-ev-sub">${esc(serviceName(b))}</span><span class="bcal-ev-sub">${esc(phoneLabel(b.phone))}</span><span class="bcal-ev-sub">com ${esc(attendant(b))}</span></button>`,
      )
      .join("");
    const more =
      list.length > MAX_CHIPS
        ? `<button type="button" class="bcal-more" onclick="selectCalDay('${d}')">+${list.length - MAX_CHIPS} mais</button>`
        : "";
    const dots = list
      .slice(0, 3)
      .map((b) => `<i class="bcal-dot ${cls(b)}"></i>`)
      .join("");
    cells.push(
      `<div class="bcal-day ${d === today ? "today" : ""} ${d === calDay ? "selected" : ""} ${d < today ? "past" : ""} ${list.length ? "has" : ""}"><button type="button" class="bcal-day-num" onclick="selectCalDay('${d}')" aria-label="${i} de ${MONTHS[m - 1]}: ${list.length} agendamento(s)" ${d === calDay ? 'aria-current="date"' : ""}><span>${i}</span>${notices.length ? `<span class="bcal-flag" title="${esc(notices.map((n) => n.title).join(", "))}">${ic("flag")}</span>` : ""}${list.length ? `<span class="bcal-count">${list.length}</span>` : ""}</button><div class="bcal-events">${chips}${more}</div><div class="bcal-dots" aria-hidden="true">${dots}</div></div>`,
    );
  }
  while (cells.length % 7) cells.push('<div class="bcal-day blank" aria-hidden="true"></div>');

  const years = [
    ...new Set([
      +today.slice(0, 4) - 1,
      +today.slice(0, 4),
      +today.slice(0, 4) + 1,
      +today.slice(0, 4) + 2,
      y,
    ]),
  ].sort();
  const dayList = byDay[calDay] || [],
    dayNotices = db.notices.filter((n) => n.date === calDay);
  const panel = `<aside class="bcal-panel" aria-label="Agendamentos do dia"><div class="bcal-panel-head"><div><span class="eyebrow">DIA SELECIONADO</span><h3>${pretty(calDay)}</h3><span class="muted">${dayList.length} agendamento${dayList.length === 1 ? "" : "s"}</span></div><button type="button" class="btn small primary" onclick="openBookingModal('${calDay}')">${ic("plus")} Novo</button></div>${dayNotices.map((n) => `<div class="notice"><strong>${ic("flag")} ${esc(n.title)}</strong>${esc(n.detail)}</div>`).join("")}${
    dayList.length
      ? `<div class="bcal-list">${dayList.map((b) => `<button type="button" class="bcal-item ${cls(b)}" onclick="bookingDetails('${b.id}')"><b class="bcal-item-time">${b.time}</b><span class="bcal-item-info"><strong>${esc(b.customer)}</strong><span>${esc(serviceName(b))} · ${money(svcTotal(b.serviceIds || b.serviceId)?.price)}</span><span>${ic("phone")} ${esc(phoneLabel(b.phone))}</span><span>${ic("user")} Atendente: ${esc(attendant(b))}</span></span><span class="status ${b.status}">${BOOKING_LABEL[b.status] || esc(b.status)}</span></button>`).join("")}</div>`
      : '<div class="empty">Nenhum agendamento neste dia.</div>'
  }</aside>`;

  return `${calFull ? "" : pageHead("Calendário", "Todos os agendamentos do mês, de todos os profissionais, em um só lugar.", `<button class="btn ghost" onclick="goCalToday()">Hoje</button><button class="btn primary" onclick="openBookingModal('${calDay}')">${ic("plus")} Novo agendamento</button>`)}<section class="bcal-shell ${calFull ? "bcal-full" : ""}" aria-label="Calendário de agendamentos"><div class="bcal-toolbar"><div class="bcal-nav"><button type="button" class="btn small" onclick="shiftAdminCal(-1)" aria-label="Mês anterior">${ic("chevLeft")}</button><select aria-label="Mês" onchange="setAdminCal(${y},+this.value)">${MONTHS.map((n, i) => `<option value="${i}" ${i === m - 1 ? "selected" : ""}>${n}</option>`).join("")}</select><select aria-label="Ano" onchange="setAdminCal(+this.value,${m - 1})">${years.map((v) => `<option ${v === y ? "selected" : ""}>${v}</option>`).join("")}</select><button type="button" class="btn small" onclick="shiftAdminCal(1)" aria-label="Próximo mês">${ic("chevRight")}</button>${calFull ? `<button type="button" class="btn small ghost" onclick="goCalToday()">Hoje</button>` : ""}</div><div class="bcal-legend"><span><i class="bcal-dot scheduled"></i>Confirmado</span><span><i class="bcal-dot pending"></i>Pendente</span><span><i class="bcal-dot done"></i>Concluído</span><b class="bcal-total">${monthCount} no mês</b></div><button type="button" class="btn small bcal-full-btn" onclick="toggleCalFull()" aria-pressed="${calFull}" title="${calFull ? "Sair da tela cheia" : "Maximizar calendário"}">${ic(calFull ? "minimize" : "maximize")}<span>${calFull ? "Minimizar" : "Maximizar"}</span></button></div><div class="bcal-body"><div class="bcal-main"><div class="bcal-weekdays">${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}</div><div class="bcal-grid">${cells.join("")}</div></div>${panel}</div></section>`;
}
function adminPage() {
  let menu = [
    ["overview", "layout", "Visão geral"],
    ["agenda", "calendar", "Agenda"],
    ["calendar", "calendarRange", "Calendário"],
    ["bookings", "list", "Agendamentos"],
    ["clients", "users", "Clientes"],
    ["finance", "wallet", "Financeiro"],
    ["services", "scissors", "Serviços"],
    ["staff", "userCog", "Profissionais"],
    ["hours", "clock", "Horários da semana"],
    ["notices", "flag", "Avisos e bloqueios"],
    ["settings", "settings", "Configurações"],
  ];
  return `<div class="admin ${sideCollapsed ? "side-collapsed" : ""}"><button type="button" class="bf-mobile-backdrop" onclick="closeMobileMenu()" aria-label="Fechar menu"></button><aside class="sidebar" id="barber-sidebar" aria-label="Menu de gestão"><div class="side-top"><div class="side-label">PAINEL DE CONTROLE</div><button class="side-toggle" onclick="toggleSide()" aria-label="${sideCollapsed ? "Expandir menu" : "Recolher menu"}" title="${sideCollapsed ? "Expandir menu" : "Recolher menu"}">${ic(sideCollapsed ? "chevRight" : "chevLeft")}</button></div><div class="side-menu">${menu.map((m) => `<button class="side-btn ${section === m[0] ? "active" : ""}" ${section === m[0] ? 'aria-current="page"' : ""} onclick="setAdminSection('${m[0]}')" title="${m[2]}"><span class="side-ic">${ic(m[1])}</span><span class="side-txt">${m[2]}</span></button>`).join("")}</div><div class="side-foot"><button class="side-btn" onclick="toggleTheme()" title="${theme === "light" ? "Modo escuro" : "Modo claro"}"><span class="side-ic">${ic(theme === "light" ? "moon" : "sun")}</span><span class="side-txt">${theme === "light" ? "Modo escuro" : "Modo claro"}</span></button><button class="side-btn" onclick="go('public')" title="Site do cliente"><span class="side-ic">${ic("arrowRight")}</span><span class="side-txt">Site do cliente</span></button><button class="side-btn side-exit" onclick="logout()" title="Sair da gestão"><span class="side-ic">${ic("ban")}</span><span class="side-txt">Sair da gestão</span></button></div></aside><main class="main">${adminContent()}</main></div>`;
}
function pageHead(title, subtitle, extra = "") {
  return `<div class="page-head"><div><div class="eyebrow">PAINEL DA BARBEARIA</div><h1>${title}</h1><span class="muted">${subtitle}</span></div><div class="head-actions ${title === "Financeiro" ? "bf-finance-actions" : ""}">${extra}</div></div>`;
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
  expandedHoursDay = null,
  selectedAgendaStaff = null;
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
    const allAgendaStaff = db.staff.filter((p) => p.active);
    if (selectedAgendaStaff === null) selectedAgendaStaff = "all";
    if (selectedAgendaStaff !== "all" && !allAgendaStaff.some((p) => p.id === selectedAgendaStaff))
      selectedAgendaStaff = "all";
    const employees =
      selectedAgendaStaff === "all"
        ? allAgendaStaff
        : allAgendaStaff.filter((p) => p.id === selectedAgendaStaff);
    const daybook = activeBookings().filter((b) => b.date === date);
    const isBooked = (b) =>
      b.status === "concluido" ? "done" : b.status === "pendente" ? "pending" : "scheduled";
    const times = Array.from({ length: 25 }, (_, i) => clock(8 * 60 + i * 30));
    const count = daybook.filter((b) => employees.some((p) => p.id === b.staffId)).length;
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
    return `<div class="premium-agenda">${pageHead("Agenda", "Visualize atendimentos por horário e profissional.", `<button class="btn ghost" onclick="changeAgendaDate(today)">Hoje</button><button class="btn primary" onclick="openBookingModal()">${ic("plus")} Novo agendamento</button>`)}
 <div class="agenda-controls"><div class="day-nav"><button class="btn small" onclick="changeAgendaDate(addDays(date,-1))">${ic("chevLeft")}</button><input type="date" value="${date}" aria-label="Selecionar data" onchange="if(this.value)changeAgendaDate(this.value)"><select aria-label="Mês" onchange="changeAgendaDate(setYM(date,null,+this.value))">${MONTHS.map((m, i) => `<option value="${i}" ${+date.slice(5, 7) - 1 === i ? "selected" : ""}>${m}</option>`).join("")}</select><select aria-label="Ano" onchange="changeAgendaDate(setYM(date,+this.value,null))">${(() => {
   const y = +today.slice(0, 4),
     c = +date.slice(0, 4);
   return [...new Set([y - 1, y, y + 1, y + 2, y + 3, c])]
     .sort()
     .map((v) => `<option ${v === c ? "selected" : ""}>${v}</option>`)
     .join("");
 })()}</select><button class="btn small" onclick="changeAgendaDate(addDays(date,1))">${ic("chevRight")}</button></div><label class="bf-agenda-staff-filter"><span>Profissional</span><select aria-label="Selecionar profissional da agenda" onchange="selectedAgendaStaff=this.value;refreshAgendaStaff()"><option value="all" ${selectedAgendaStaff === "all" ? "selected" : ""}>Todos os profissionais</option>${allAgendaStaff.map((p) => `<option value="${p.id}" ${selectedAgendaStaff === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label>${selectedAgendaStaff === "all" && allAgendaStaff.length > 1 ? `<span class="muted bf-agenda-swipe-hint">${ic("arrowRight")} <span>Deslize a agenda para ver outros profissionais</span></span>` : ""}</div>
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
  if (section === "calendar") return calendarPage();
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
        )}</select></label><label>Cliente<input id="bfName" oninput="typeFilter(applyBookingFilter,'bfName')" placeholder="Nome do cliente" value="${esc(bf.name)}"></label><div class="filter-actions"><button class="btn filter-clear" type="button" ${active ? "" : "disabled"} onclick="clearBookingFilters()">Limpar</button></div></form><p class="muted filter-count">${rows.length} agendamento(s) encontrado(s)${active ? " com os filtros aplicados" : ""}.</p><div class="card">${bookingsTable(rows)}</div>`;
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
    return `${pageHead("Clientes", "Histórico e relacionamento com seus clientes.")}<form class="card filter-bar" onsubmit="event.preventDefault();applyClientFilter()"><label>Cliente<input id="cfName" oninput="typeFilter(applyClientFilter,'cfName')" placeholder="Nome ou telefone" value="${esc(cf.name)}"></label><label>Atendido por<select id="cfStaff" onchange="applyClientFilter()"><option value="">Todos</option>${db.staff.map((x) => `<option value="${x.id}" ${cf.staff === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label><div class="filter-actions"><button class="btn filter-clear" type="button" ${cf.name || cf.staff ? "" : "disabled"} onclick="clearClientFilters()">Limpar</button></div></form><p class="muted filter-count">${list.length} cliente(s) encontrado(s).</p><div class="card"><div class="tablewrap"><table class="table"><tr><th>Nome</th><th>Telefone</th><th>Agendamentos</th><th>Total pago</th><th>Última visita marcada</th></tr>${list.length ? "" : '<tr><td colspan="5" class="empty">Nenhum cliente encontrado.</td></tr>'}${list.map((c) => `<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${c.count}</td><td>${money(c.spent)}</td><td>${pretty(c.last)}</td></tr>`).join("")}</table></div></div>`;
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
    return `${pageHead("Configurações", "Personalize informações exibidas no site da barbearia.")}<div class="card" style="max-width:680px"><div class="forms"><label>Nome comercial<input id="setName" value="${esc(db.shop.name)}"></label><label>Frase do destaque<input id="setTag" value="${esc(db.shop.tagline)}"></label><label>WhatsApp da barbearia<input id="setPhone" value="${esc(db.shop.whatsapp)}" placeholder="5579999999999"></label><label>Telefone (opcional)<input id="setPhoneAlt" value="${esc(db.shop.phone || "")}" placeholder="(79) 3000-0000" inputmode="tel"></label><fieldset class="set-social"><legend>Redes sociais (opcional)</legend><label>Instagram<input id="setInstagram" value="${esc(db.shop.instagram || "")}" placeholder="@suabarbearia ou link do perfil"></label><label>Facebook<input id="setFacebook" value="${esc(db.shop.facebook || "")}" placeholder="link da página ou nome da página"></label><small class="muted">Só aparecem no site as redes preenchidas. O WhatsApp usa o número acima.</small></fieldset><label>Descrição / endereço<textarea id="setAddress" rows="3">${esc(db.shop.address)}</textarea></label><button class="btn primary" onclick="saveSettings()">Salvar alterações</button></div></div>`;
  return "";
}
window.__barberRemount = (v) => {
  view = v;
  if (v !== "admin") closeModal();
  render();
  window.scrollTo(0, 0);
};
function toggleMobileMenu() {
  const admin = document.querySelector(".admin");
  if (!admin) return;
  const open = !admin.classList.contains("bf-mobile-open");
  admin.classList.toggle("bf-mobile-open", open);
  document.body.classList.toggle("bf-mobile-menu-lock", open);
  const button = document.querySelector(".bf-mobile-menu-button");
  if (button) {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Fechar menu da gestão" : "Abrir menu da gestão");
  }
  if (open) {
    admin.querySelector(".side-menu .side-btn.active")?.scrollIntoView({ block: "nearest" });
  }
}
function closeMobileMenu() {
  document.querySelector(".admin")?.classList.remove("bf-mobile-open");
  document.body.classList.remove("bf-mobile-menu-lock");
  const button = document.querySelector(".bf-mobile-menu-button");
  if (button) {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu da gestão");
  }
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});
function toggleSide() {
  sideCollapsed = !sideCollapsed;
  localStorage.setItem("barberSide", sideCollapsed ? "1" : "0");
  const admin = document.querySelector(".admin");
  if (!admin) return;
  admin.classList.toggle("side-collapsed", sideCollapsed);
  const button = admin.querySelector(".side-toggle");
  if (button) {
    button.innerHTML = ic(sideCollapsed ? "chevRight" : "chevLeft");
    button.setAttribute("aria-label", sideCollapsed ? "Expandir menu" : "Recolher menu");
    button.title = sideCollapsed ? "Expandir menu" : "Recolher menu";
  }
}
function changeAgendaDate(value) {
  date = value;
  if (view === "admin" && section === "agenda") refreshAgendaStaff();
  else render();
}
function refreshAgendaStaff() {
  if (view !== "admin" || section !== "agenda") return;
  const main = document.querySelector(".admin .main");
  if (!main) return;
  morphHTML(main, adminContent());
}
function setAdminSection(next) {
  closeMobileMenu();
  if (section === next) return;
  section = next;
  render();
}
function render() {
  if (view !== "admin") closeMobileMenu();
  {
    let want = view === "admin" ? "/login" : "/";
    if (location.pathname !== want && !location.hash.includes("type=recovery"))
      history.replaceState(null, "", want);
  }
  document.body.classList.toggle("theme-light", view === "admin" && !!token && theme === "light");
  document.title = `${db.shop.name} • ${view === "admin" ? "Gestão" : view === "booking" ? "Agendamento" : "Barbearia"}`;
  if (calFull && !(view === "admin" && token && section === "calendar")) dropCalFull();
  const app = $("#app");
  const html =
    header() +
    (view === "public"
      ? publicPage()
      : view === "admin"
        ? token
          ? adminPage()
          : loginPage()
        : bookingPage());
  // "Tela" = site público, agendamento, login ou painel. Só uma troca de tela recria o DOM
  // (com animação de entrada); qualquer outra atualização apenas ajusta o que mudou.
  const screen = view === "admin" ? (token ? "panel" : "login") : view;
  const screenChanged = screen !== renderedScreen || !app.firstElementChild;
  if (screenChanged) {
    app.innerHTML = html;
    app
      .querySelectorAll(".hero-inner, .booking-area, .main, .auth-card")
      .forEach((el) => el.classList.add("bf-enter"));
  } else {
    const sectionChanged = screen === "panel" && section !== renderedSection;
    if (sectionChanged) app.querySelector(".main")?.replaceChildren(); // conteúdo novo: não compara com o da seção anterior
    morphHTML(app, html);
    if (screen === "booking" && step !== renderedStep)
      replayEnter(app.querySelector(".booking-area"));
    if (sectionChanged) replayEnter(app.querySelector(".main"), "bf-page-enter");
  }
  renderedScreen = screen;
  renderedStep = step;
  renderedSection = section;
}
let renderedScreen = null,
  renderedStep = null,
  renderedSection = null;
function toast(t) {
  let message = String(t || "");
  if (
    /(?:is not defined|undefined|null|TypeError|ReferenceError|SyntaxError|Error:|stack|SQLITE_|internal server error|fetch failed)/i.test(
      message,
    )
  )
    message = "Ocorreu um erro no sistema. Tente novamente em instantes.";
  if (window.__barberReactToast) {
    window.dispatchEvent(
      new CustomEvent("barber:toast", {
        detail: {
          message,
          type: /(erro|falha|não foi possível|inválid|indispon|reservado|expirou|sem conexão)/i.test(
            message,
          )
            ? "error"
            : "info",
        },
      }),
    );
    return;
  }
  $("#toastbox").innerHTML = `<div class="toast" role="alert">${esc(message)}</div>`;
  setTimeout(() => {
    const box = $("#toastbox");
    if (box) box.innerHTML = "";
  }, 3500);
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
    `<div class="summary-box"><strong>${esc(b.customer)}</strong><span>${b.phone ? esc(phoneLabel(b.phone)) : "Telefone não informado"}</span><span>${pretty(b.date)} às ${b.time}</span><span>${esc(svcTotal(b.serviceIds || b.serviceId)?.name || "Serviço")} • ${money(svcTotal(b.serviceIds || b.serviceId)?.price)}</span><span>Profissional: ${esc(staff(b.staffId)?.name || "—")}</span></div><div class="forms" style="margin-top:18px"><label>Status<select id="dStatus" onchange="if(this.value==='concluido')$('#dPaid').checked=true">${[
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
    phone: $("#setPhoneAlt").value.trim(),
    instagram: $("#setInstagram").value.trim(),
    facebook: $("#setFacebook").value.trim(),
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
    `<main class="wrap section"><div class="card"><h2>Não foi possível conectar à API</h2><p class="muted">${esc(String(e.message).replace(/[.\s]+$/, ""))}. Tente novamente em instantes.</p><button class="btn primary" onclick="location.reload()">Tentar novamente</button></div></main>`;
});
