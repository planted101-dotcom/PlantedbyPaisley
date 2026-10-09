
  // ── the wildflower band under the hero ──
  // Every petal is a div with a lopsided border-radius, rotated around a
  // shared centre. To change a flower, edit the numbers in SPECS below.
  //   h      how tall the stem is, as a share of the space above the ground line
  //   petals how many petals
  //   w/len  petal width and length, as a share of that same space
  //   color  which palette colour
  (function () {
    var garden = document.getElementById('garden');
    if (!garden) return;

    var SPECS = [
      { h:.46, petals:6,  w:.105, len:.20, color:'var(--blush)'  },
      { h:.62, petals:8,  w:.080, len:.22, color:'var(--sky)'    },
      { h:.36, petals:5,  w:.125, len:.17, color:'var(--gold)'   },
      { h:.56, petals:12, w:.055, len:.24, color:'var(--lilac)'  },
      { h:.42, petals:6,  w:.115, len:.18, color:'var(--rose)'   },
      { h:.52, petals:9,  w:.072, len:.21, color:'var(--meadow)' }
    ];

    function build() {
      var above = garden.clientHeight * 0.6;   // space above the ground line
      if (!above) return;
      garden.innerHTML = '';

      SPECS.forEach(function (s, i) {
        var plant = document.createElement('div');
        plant.className = 'plant';

        var pw = above * s.w, pl = above * s.len;
        // stem plus the bloom on top must stay inside the band
        var stemH = Math.min(above * s.h, above - pl - above * 0.06);
        var stem = document.createElement('div');
        stem.className = 'stem';
        stem.style.height = stemH + 'px';
        stem.style.marginBottom = (garden.clientHeight * 0.4) + 'px';
        stem.style.animationDelay = (i * 0.11) + 's';

        ['left', 'right'].forEach(function (side, n) {
          var leaf = document.createElement('div');
          leaf.className = 'leaf' + (side === 'right' ? ' right' : '');
          leaf.style.width  = (above * 0.13) + 'px';
          leaf.style.height = (above * 0.055) + 'px';
          leaf.style.bottom = (garden.clientHeight * 0.4 + stemH * (n ? 0.58 : 0.40)) + 'px';
          leaf.style[side] = '50%';
          leaf.style.animationDelay = (0.7 + i * 0.11) + 's';
          plant.appendChild(leaf);
        });

        var flower = document.createElement('div');
        flower.className = 'flower';
        flower.style.bottom = (garden.clientHeight * 0.4 + stemH) + 'px';
        flower.style.animationDelay = (0.95 + i * 0.11) + 's';

        for (var p = 0; p < s.petals; p++) {
          var petal = document.createElement('div');
          petal.className = 'petal';
          petal.style.width = pw + 'px';
          petal.style.height = pl + 'px';
          petal.style.left = (-pw / 2) + 'px';
          petal.style.top = (-pl) + 'px';
          petal.style.background = s.color;
          petal.style.opacity = p % 2 ? .82 : 1;
          petal.style.transform = 'rotate(' + (p * 360 / s.petals) + 'deg)';
          flower.appendChild(petal);
        }
        var core = document.createElement('div');
        core.className = 'core';
        core.style.width = core.style.height = (pw * 0.8) + 'px';
        core.style.left = core.style.top = (-pw * 0.4) + 'px';
        flower.appendChild(core);

        // ── roots ──
        // Each root is a chain of short segments. Every segment is nested
        // inside the one above it and rotated a few more degrees, so the
        // rotations stack up and the whole thing reads as a curve.
        // [start angle, length share, curve per segment, segments, twigs]
        // twigs: [which segment, angle off it, length share, curve, segments]
        var below = garden.clientHeight * 0.4;
        var ROOTS = [
          [-62, .34, -7, 4, [[1,  36, .55, 7, 3]]],
          [-31, .58, -6, 5, [[1,  40, .48, 8, 3], [3, -26, .34, -6, 2]]],
          [ -6, .70,  4, 5, [[2, -38, .44, -7, 3], [3, 30, .38, 7, 2]]],
          [ 27, .56,  7, 4, [[1, -34, .50, -6, 3], [2, 26, .32, 6, 2]]],
          [ 58, .32,  9, 3, [[1, -30, .52, -5, 2]]]
        ];

        function chain(parent, topOffset, angle, len, curve, count, width, delay) {
          var segLen = len / count, prev = parent, made = [];
          for (var k = 0; k < count; k++) {
            var seg = document.createElement('div');
            seg.className = 'root';
            seg.style.width = Math.max(1.4, width - k * 0.4) + 'px';
            seg.style.height = segLen + 'px';
            seg.style.top = (k === 0 ? topOffset : segLen - 1) + 'px';
            seg.style.rotate = (k === 0 ? angle : curve) + 'deg';
            seg.style.opacity = Math.max(.45, 1 - k * 0.09);
            seg.style.animationDelay = (delay + k * 0.07) + 's';
            prev.appendChild(seg);
            prev = seg;
            made.push(seg);
          }
          return made;
        }

        ROOTS.forEach(function (r, n) {
          var segs = chain(plant, garden.clientHeight * 0.6, r[0],
                           below * r[1], r[2], r[3], 3.4,
                           0.35 + i * 0.11 + n * 0.05);
          r[4].forEach(function (t, m) {
            var host = segs[Math.min(t[0], segs.length - 1)];
            chain(host, (below * r[1] / r[3]) * 0.45, t[1],
                  below * r[1] * t[2], t[3], t[4], 2.4,
                  0.75 + i * 0.11 + n * 0.05 + m * 0.06);
          });
        });

        plant.appendChild(stem);
        plant.appendChild(flower);
        garden.appendChild(plant);
      });
    }

    build();
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(build, 250);
    });
  })();

  // Gallery: hide any photo that has not been added yet, and flip before/after.
  (function () {
    document.querySelectorAll('.shot .frame img').forEach(function (img) {
      img.addEventListener('error', function () { img.classList.add('missing'); });
      if (img.complete && img.naturalWidth === 0) img.classList.add('missing');
    });

    document.querySelectorAll('.shot .flip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var shot = btn.closest('.shot');
        var before = shot.classList.toggle('is-before');
        btn.textContent = before ? 'Show after' : 'Show before';
        shot.querySelector('.stamp').textContent = before ? 'Before' : 'After';
      });
    });
  })();

  // ═══════════════════════════════════════════════════════
  //  SETTINGS. This is the only block you need to edit.
  // ═══════════════════════════════════════════════════════
  var SETTINGS = {
    // Your phone. Digits only for tel, pretty version for display.
    phoneDigits: '+12085152059',
    phoneShown: '(208) 515-2059',

    email: 'paisley@plantedbypaisley.com',

    // Pick ONE form service and paste its key. Leave the other blank.
    // web3forms.com  gives you an access key with no account needed.
    // formspree.io   gives you an endpoint that looks like https://formspree.io/f/abcdwxyz
    web3formsKey: '70a255d9-dae6-42b7-94b5-85ae8e1f1aed',
    formspreeEndpoint: '',

    // Your hourly rate, and how many hours a typical job takes.
    // Change these numbers and the estimator updates itself.
    hourlyRate: 35,
    hours: {
      maintenance: { small: 1.0,  medium: 1.5, large: 2.5 },
      design:      { small: 2.5,  medium: 4.0, large: 6.0 },
      cleanup:     { small: 4.0,  medium: 8.0, large: 14.0 },
      fertilizer:  { small: 0.75, medium: 1.25, large: 2.0 }
    },

    // The date picker on the Services page won't let anyone pick a date
    // sooner than this many days from today.
    minLeadDays: 2,

    // Paste a Google Calendar "public embed" URL here to show your real
    // schedule next to the date picker. Leave blank to show the placeholder
    // message instead. Get this from Google Calendar settings, under
    // "Integrate calendar" -> "Embed code" -> copy the src="..." URL only.
    googleCalendarEmbedSrc: 'https://calendar.google.com/calendar/embed?src=df22e6d2f9336f7936d0777d7b94b210cced71048c88994abae3a09b0fc90912%40group.calendar.google.com&ctz=America%2FDenver',

    // Falling leaves for fall.
    //   'auto'  shows them September through November, hides them the rest of the year
    //   true    always on
    //   false   always off
    fallLeaves: 'auto',
    // How many leaves on screen at once (phones get about half).
    fallLeafCount: 14
  };
  // ═══════════════════════════════════════════════════════

  // ── falling leaves ──
  // A layer that sits over the page but never blocks clicks. Each leaf
  // falls on one animation and sways side to side on another, so the
  // two motions combine into a drifting path. Skipped for anyone who has
  // asked their device for reduced motion.
  (function () {
    var on = SETTINGS.fallLeaves;
    if (on === 'auto') {
      var m = new Date().getMonth(); // 8 = September, 10 = November
      on = m >= 8 && m <= 10;
    }
    if (!on) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var COLORS = ['#E39B4B', '#D9733F', '#C9573A', '#E9C35A', '#E88AAE', '#B8743A'];
    // two leaf shapes: a rounded oval leaf and a pointed one, each with a midrib
    var SHAPES = [
      'M12 1C5 6 3 13 6 19c2 3 4 4 6 4s4-1 6-4c3-6 1-13-6-18z',
      'M12 1C7 4 2 9 3 15c1 4 5 7 9 8 4-1 8-4 9-8 1-6-4-11-9-14z'
    ];

    var layer = document.createElement('div');
    layer.className = 'leaf-fall';
    layer.setAttribute('aria-hidden', 'true');

    var count = window.innerWidth < 620 ? Math.ceil(SETTINGS.fallLeafCount / 2) : SETTINGS.fallLeafCount;

    function rand(a, b) { return a + Math.random() * (b - a); }

    for (var i = 0; i < count; i++) {
      var leaf = document.createElement('span');
      leaf.className = 'fall-leaf';
      var size = rand(16, 30);
      var fall = rand(11, 20);
      leaf.style.left = rand(0, 100) + 'vw';
      leaf.style.width = leaf.style.height = size + 'px';
      leaf.style.animationDuration = fall + 's';
      // negative delay so some leaves are already partway down on load
      leaf.style.animationDelay = (-rand(0, fall)) + 's';

      var sway = document.createElement('span');
      sway.className = 'fall-sway';
      sway.style.setProperty('--drift', rand(30, 90) + 'px');
      sway.style.setProperty('--spin', rand(140, 320) * (Math.random() < .5 ? -1 : 1) + 'deg');
      sway.style.animationDuration = rand(2.6, 4.4) + 's';
      sway.style.animationDelay = (-rand(0, 4)) + 's';

      var color = COLORS[Math.floor(Math.random() * COLORS.length)];
      var path = SHAPES[i % SHAPES.length];
      sway.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%">' +
          '<path d="' + path + '" fill="' + color + '"/>' +
          '<path d="M12 3v20" stroke="rgba(60,30,10,.35)" stroke-width="1" fill="none"/>' +
        '</svg>';

      leaf.appendChild(sway);
      layer.appendChild(leaf);
    }

    document.body.appendChild(layer);
  })();

  // Push the phone number and email everywhere they appear.
  (function () {
    document.querySelectorAll('[data-phone]').forEach(function (el) {
      el.setAttribute('href', 'tel:' + SETTINGS.phoneDigits);
      if (el.dataset.phone === 'text') el.textContent = el.dataset.prefix + SETTINGS.phoneShown;
    });
    document.querySelectorAll('[data-email]').forEach(function (el) {
      el.setAttribute('href', 'mailto:' + SETTINGS.email);
      el.textContent = SETTINGS.email;
    });
  })();

  // ── date picker on the Services page ──
  // Real month-by-month calendar math, no external library. Clicking a
  // date sends the visitor to the home page's contact form with that
  // date already filled in.
  (function () {
    var grid = document.getElementById('picker-grid');
    if (!grid) return;

    var monthLabel = document.getElementById('picker-month');
    var prevBtn = document.getElementById('picker-prev');
    var nextBtn = document.getElementById('picker-next');
    var status = document.getElementById('picker-status');
    var continueBtn = document.getElementById('picker-continue');

    var MONTHS = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
    var DAY_WORDS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var earliest = new Date(today);
    earliest.setDate(earliest.getDate() + SETTINGS.minLeadDays);

    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = null;

    function sameDay(a, b) {
      return a && b && a.getFullYear() === b.getFullYear() &&
             a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    function render() {
      monthLabel.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      grid.innerHTML = '';

      var firstWeekday = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
      var daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

      for (var b = 0; b < firstWeekday; b++) {
        var blank = document.createElement('span');
        blank.className = 'picker-day is-blank';
        grid.appendChild(blank);
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var date = new Date(view.getFullYear(), view.getMonth(), d);
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'picker-day';
        cell.textContent = d;

        var tooSoon = date < earliest;
        if (tooSoon) cell.classList.add('is-disabled');
        if (sameDay(date, today)) cell.classList.add('is-today');
        if (sameDay(date, selected)) cell.classList.add('is-selected');

        if (!tooSoon) {
          cell.addEventListener('click', function (chosenDate) {
            return function () {
              selected = chosenDate;
              render();
              var label = DAY_WORDS[chosenDate.getDay()] + ', ' +
                MONTHS[chosenDate.getMonth()] + ' ' + chosenDate.getDate();
              status.innerHTML = '<p>You picked <strong>' + label +
                '</strong>. Tap the button below to fill out the form, and I\'ll confirm that day or suggest another one.</p>';
              var iso = chosenDate.getFullYear() + '-' +
                String(chosenDate.getMonth() + 1).padStart(2, '0') + '-' +
                String(chosenDate.getDate()).padStart(2, '0');
              continueBtn.href = 'index.html?date=' + iso + '#contact';
              continueBtn.textContent = 'Request ' + MONTHS[chosenDate.getMonth()] + ' ' + chosenDate.getDate();
              continueBtn.classList.add('is-ready');
            };
          }(date));
        }

        grid.appendChild(cell);
      }

      var isCurrentMonth = view.getFullYear() === today.getFullYear() &&
                            view.getMonth() === today.getMonth();
      prevBtn.disabled = isCurrentMonth;
    }

    prevBtn.addEventListener('click', function () {
      view.setMonth(view.getMonth() - 1);
      render();
    });
    nextBtn.addEventListener('click', function () {
      view.setMonth(view.getMonth() + 1);
      render();
    });

    render();

    // Show the real calendar if a Google Calendar embed URL is set.
    var gcalHost = document.getElementById('gcal-embed');
    if (gcalHost && SETTINGS.googleCalendarEmbedSrc) {
      gcalHost.innerHTML = '<iframe src="' + SETTINGS.googleCalendarEmbedSrc +
        '" title="Current schedule"></iframe>';
    }
  })();

  // ── carry a picked date over to the contact form ──
  // If the URL looks like index.html?date=2026-08-15, drop that date
  // into the quote form's date field and scroll the visitor to it.
  (function () {
    var dateField = document.getElementById('q-date');
    if (!dateField) return;

    var params = new URLSearchParams(window.location.search);
    var picked = params.get('date');
    if (!picked) return;

    var parts = picked.split('-');
    if (parts.length === 3) {
      var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      var MONTHS = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
      dateField.value = MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    var form = document.getElementById('quote');
    if (form) {
      window.setTimeout(function () {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        dateField.focus();
      }, 300);
    }
  })();

  // Estimate calculator.
  (function () {
    var job = document.getElementById('c-job');
    var size = document.getElementById('c-size');
    var freq = document.getElementById('c-freq');
    var out = document.getElementById('c-out');
    var note = document.getElementById('c-note');
    var freqWrap = document.getElementById('c-freq-wrap');
    if (!job) return;

    function money(n) { return '$' + Math.round(n / 5) * 5; }

    function update() {
      var recurring = job.value === 'maintenance' || job.value === 'fertilizer';
      freqWrap.style.display = recurring ? '' : 'none';

      var h = Math.max(SETTINGS.hours[job.value][size.value], 1); // one hour minimum
      var mid = h * SETTINGS.hourlyRate;
      out.textContent = money(mid * 0.85) + ' to ' + money(mid * 1.2);

      var per = recurring && freq.value !== '1' ? ' per visit' : '';
      var txt = 'About ' + h + (h === 1 ? ' hour' : ' hours') + ' of work' + per + '.';
      if (h === 1) txt += ' One hour is my minimum.';

      if (recurring && freq.value !== '1') {
        var visits = freq.value === '2' ? 2.2 : 1;
        txt += ' That\'s roughly ' + money(mid * visits * 0.85) + ' to ' +
               money(mid * visits * 1.2) + ' a month.';
      }
      if (job.value === 'cleanup' && h > 4) {
        txt += ' I\'d split this into ' + Math.ceil(h / 4) + ' days.';
      }
      note.textContent = txt;
    }

    [job, size, freq].forEach(function (el) { el.addEventListener('change', update); });
    update();
  })();

  // Quote form. Sends in the background, never opens an email app.
  (function () {
    var form = document.getElementById('quote');
    if (!form) return;
    var status = form.querySelector('.status');
    var submit = form.querySelector('button[type=submit]');

    function say(msg, kind) {
      status.textContent = msg;
      status.className = 'status ' + (kind || '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('[name=_gotcha]').value) return;

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      delete data._gotcha; // spam check only, never send it on

      if (!data.name.trim() || !data.phone.trim()) {
        say('Please add your name and phone number so I can get back to you.', 'bad');
        return;
      }

      var url, payload;
      if (SETTINGS.web3formsKey) {
        url = 'https://api.web3forms.com/submit';
        data.access_key = SETTINGS.web3formsKey;
        data.subject = 'Quote request from ' + data.name;
        payload = data;
      } else if (SETTINGS.formspreeEndpoint) {
        url = SETTINGS.formspreeEndpoint;
        payload = data;
      } else {
        say('The form isn\'t working right now. Please text me at ' + SETTINGS.phoneShown + ' instead.', 'bad');
        return;
      }

      submit.disabled = true;
      say('Sending...');

      fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('bad response');
        form.reset();
        say('Thanks! I got your request and will text you back within a day.', 'ok');
      }).catch(function () {
        say('Something went wrong. Please text me at ' + SETTINGS.phoneShown + ' instead.', 'bad');
      }).then(function () {
        submit.disabled = false;
      });
    });
  })();

  // "Text this to me instead" button. Opens the visitor's own messaging app
  // with their form answers already typed into a text to Paisley.
  (function () {
    var btn = document.getElementById('text-instead');
    var form = document.getElementById('quote');
    if (!btn || !form) return;

    btn.addEventListener('click', function () {
      function val(name) {
        var el = form.querySelector('[name=' + name + ']');
        return el && el.value.trim() ? el.value.trim() : '';
      }
      var lines = ['Hi Paisley, I\'d like an estimate.'];
      if (val('name')) lines.push('Name: ' + val('name'));
      if (val('area')) lines.push('Area: ' + val('area'));
      if (val('service')) lines.push('Service: ' + val('service'));
      if (val('date')) lines.push('Preferred date: ' + val('date'));
      if (val('details')) lines.push('Details: ' + val('details'));
      // "?&body=" works on both iPhone and Android
      window.location.href = 'sms:' + SETTINGS.phoneDigits + '?&body=' +
        encodeURIComponent(lines.join('\n'));
    });
  })();
