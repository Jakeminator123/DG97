(function () {
  'use strict';
  var root = document.getElementById('dg97-floorplan');
  if (!root) return;
  var endpoint = 'https://www.dg97.org/api/planritning';
  var select = root.querySelector('#dg-room-select');
  var detail = root.querySelector('#dg-room-detail');
  var status = root.querySelector('#dg-update-status');
  var body = root.querySelector('tbody');
  var rooms = [];
  var state = 'loading';
  var busy = false;
  var lastCheck = 0;

  function dateLabel(date) {
    return new Date(date + 'T12:00:00Z').toLocaleDateString('sv-SE', {
      timeZone: 'Europe/Stockholm', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
  function availability(room) {
    var today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
    return room.date && room.date > today ? 'Tillgängligt från ' + dateLabel(room.date) : 'Publicerat som ledigt';
  }
  function choose(id) {
    id = Number(id);
    var room = rooms.find(function (r) { return r.id === id; });
    select.value = String(id);
    root.querySelectorAll('[data-room]').forEach(function (el) {
      el.setAttribute('aria-pressed', String(Number(el.getAttribute('data-room')) === id));
    });
    var title = document.createElement('h2');
    title.textContent = id === 23 ? 'Rum 23 – konferensrum' : 'Rum ' + id;
    var tag = document.createElement('p');
    tag.className = 'dg-status';
    if (id === 23) tag.textContent = 'Konferensrum – hyrs inte ut som kontorsrum';
    else if (state === 'loading') tag.textContent = 'Hämtar rumsuppgifter …';
    else if (state === 'error') tag.textContent = 'Kontakta oss för aktuella rumsuppgifter';
    else if (!room) tag.textContent = 'Kontakta oss för information om rummet';
    else tag.textContent = room.available ? availability(room) : 'Inte publicerat som ledigt';
    if (!room || !room.available) tag.classList.add('dg-neutral');
    detail.replaceChildren(title, tag);
    if (room) {
      var facts = document.createElement('dl');
      [['Yta', room.area.toLocaleString('sv-SE') + ' kvm'],
        ['Räkneexempel per månad', (room.area * 1200).toLocaleString('sv-SE') + ' kr exkl. moms']]
        .forEach(function (pair) {
          var term = document.createElement('dt');
          var value = document.createElement('dd');
          term.textContent = pair[0]; value.textContent = pair[1];
          facts.append(term, value);
        });
      detail.appendChild(facts);
    }
  }
  function paint() {
    root.querySelectorAll('[data-room]').forEach(function (el) {
      var id = Number(el.getAttribute('data-room'));
      var room = rooms.find(function (r) { return r.id === id; });
      el.classList.toggle('dg-available', Boolean(room && room.available));
      el.setAttribute('aria-label', id === 23 ? 'Rum 23, konferensrum' :
        'Rum ' + id + (room && room.available ? ', publicerat som tillgängligt' : ''));
    });
    body.replaceChildren();
    var available = rooms.filter(function (r) { return r.available; }).sort(function (a, b) {
      return (a.date || '').localeCompare(b.date || '') || a.id - b.id;
    });
    if (!available.length) {
      var emptyRow = document.createElement('tr');
      var cell = document.createElement('td'); cell.colSpan = 4;
      cell.textContent = state === 'loading' ? 'Hämtar aktuella uppgifter …' : state === 'error' ?
        'Uppgifterna kan inte hämtas just nu. Kontakta oss för aktuell tillgänglighet.' :
        'Inga rum är publicerade som lediga just nu. Kontakta oss för aktuell tillgänglighet.';
      emptyRow.appendChild(cell); body.appendChild(emptyRow);
    }
    available.forEach(function (room) {
      var row = document.createElement('tr');
      var heading = document.createElement('th'); heading.scope = 'row';
      var button = document.createElement('button'); button.type = 'button';
      button.textContent = 'Rum ' + room.id;
      button.addEventListener('click', function () {
        choose(room.id); select.focus(); select.scrollIntoView({ block: 'center' });
      });
      heading.appendChild(button); row.appendChild(heading);
      [room.area.toLocaleString('sv-SE') + ' kvm', availability(room),
        (room.area * 1200).toLocaleString('sv-SE') + ' kr'].forEach(function (text) {
        var cell = document.createElement('td'); cell.textContent = text; row.appendChild(cell);
      });
      body.appendChild(row);
    });
    choose(select.value);
  }
  function validate(payload) {
    if (!payload || payload.status !== 'ok' || !Array.isArray(payload.rooms)
      || payload.rooms.length > 22 || !Number.isFinite(Date.parse(payload.checkedAt))) throw new Error('Invalid feed');
    var seen = new Set();
    return payload.rooms.map(function (room) {
      if (!Number.isInteger(room.id) || room.id < 1 || room.id > 22 || seen.has(room.id)
        || typeof room.area !== 'number' || !Number.isFinite(room.area) || room.area <= 0 || room.area > 200
        || typeof room.available !== 'boolean') throw new Error('Invalid room');
      seen.add(room.id);
      if (room.date !== null && (typeof room.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(room.date)
        || new Date(room.date + 'T12:00:00Z').toISOString().slice(0, 10) !== room.date)) throw new Error('Invalid date');
      return { id: room.id, area: room.area, available: room.available, date: room.available ? room.date : null };
    });
  }
  async function refresh() {
    if (busy) return;
    busy = true;
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 12000);
    try {
      var response = await fetch(endpoint, {
        credentials: 'omit', cache: 'no-store', signal: controller.signal
      });
      if (!response.ok) throw new Error('Feed unavailable');
      var payload = await response.json();
      rooms = validate(payload); state = 'ready'; lastCheck = Date.now();
      status.textContent = 'Uppgifterna hämtas automatiskt. Senast kontrollerat ' +
        new Date(payload.checkedAt).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm',
          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + '.';
    } catch (error) {
      rooms = []; state = 'error';
      status.textContent = 'Automatisk uppdatering är tillfälligt otillgänglig. Kontakta oss för aktuella uppgifter.';
    } finally {
      clearTimeout(timeout); busy = false; paint();
    }
  }
  select.addEventListener('change', function () { choose(select.value); });
  root.querySelectorAll('[data-room]').forEach(function (el) {
    el.addEventListener('click', function () {
      choose(el.getAttribute('data-room'));
      if (window.matchMedia('(max-width:760px)').matches) select.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    el.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(el.getAttribute('data-room')); }
    });
  });
  paint(); refresh();
  setInterval(function () { if (!document.hidden) refresh(); }, 300000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && Date.now() - lastCheck >= 300000) refresh();
  });
})();
