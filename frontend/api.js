// Ponte entre a interface (app.js) e a API REST do backend.
// O app.js chama window.__barberApi(rota, { method, body }) e espera o JSON de resposta.
(function () {
  var KEY = 'barber_token';
  var base = (window.BARBER_API_URL || '').replace(/\/$/, '') + '/api';

  window.__barberToken = localStorage.getItem(KEY) || '';
  window.__barberStartView = location.pathname.replace(/\/$/, '') === '/login' ? 'admin' : 'public';

  window.__barberApi = async function (route, options) {
    options = options || {};
    var headers = { 'Content-Type': 'application/json' };
    var token = localStorage.getItem(KEY);
    if (token) headers.Authorization = 'Bearer ' + token;
    var res;
    try {
      res = await fetch(base + route, { method: options.method || (options.body ? 'POST' : 'GET'), headers: headers, body: options.body });
    } catch (e) {
      throw new Error('Servidor indisponível. Verifique se o backend está rodando.');
    }
    var data = await res.json().catch(function () { return {}; });
    if (res.status === 401 && route !== '/login') { localStorage.removeItem(KEY); window.__barberToken = ''; }
    if (!res.ok || data.error) throw new Error(data.error || 'Erro ' + res.status);
    if (route === '/login' && data.token) { localStorage.setItem(KEY, data.token); window.__barberToken = data.token; }
    if (route === '/logout') { localStorage.removeItem(KEY); window.__barberToken = ''; }
    return data;
  };
})();
