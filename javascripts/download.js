// Прямое скачивание APK с кнопки «Скачать последнюю версию».
//
// При загрузке страницы спрашиваем GitHub API, какой ассет актуален,
// и подменяем href кнопки на прямой URL + дописываем версию в подпись.
// Fallback — исходная ссылка на страницу релиза: работает без JS и
// при недоступном API (кнопка просто ведёт на страницу, юзер кликает
// APK руками).
//
// Лимит unauthenticated GitHub API — 60 запросов/час с IP посетителя;
// один вызов на загрузку главной страницы, запас огромный. CORS у
// api.github.com открыт, с GitHub Pages работает.
// Ассет выбираем как и self-update приложения: первый с суффиксом .apk
// (см. UpdateRepository.kt) — логика выбора не должна расходиться.
(function () {
  var btn = document.querySelector(
    'a.md-button--primary[href*="/releases/latest"]');
  if (!btn) return;

  fetch('https://api.github.com/repos/victorlapin/tg-proxy-releases/releases/latest')
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (rel) {
      if (!rel) return;
      var apk = (rel.assets || []).filter(function (a) {
        return /\.apk$/i.test(a.name);
      })[0];
      if (!apk) return;
      btn.href = apk.browser_download_url;
      var tag = (rel.tag_name || '').replace(/^v/, '');
      if (tag) {
        btn.appendChild(document.createTextNode(' (' + tag + ')'));
      }
    });
})();
