/* =========================================
   panorama360.js
   - Panorama Dial
   - Hamburger Menu
   - FAQ Accordion
   - Stats Counter Animation
   - Scroll Reveal
========================================= */

(function () {
  'use strict';

  /* ===== 1. PANORAMA DIAL ===== */
  var roomSVGs = [
    // living room
    '<svg viewBox="0 0 380 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\
      <rect width="380" height="380" fill="#182124"/>\
      <rect y="260" width="380" height="120" fill="#12191b"/>\
      <rect x="30" y="150" width="110" height="110" fill="#233230" opacity="0.75"/>\
      <rect x="180" y="120" width="170" height="140" fill="#2a3a38" opacity="0.55"/>\
      <rect x="200" y="200" width="60" height="60" fill="#c9a227" opacity="0.18"/>\
      <line x1="0" y1="150" x2="380" y2="150" stroke="#3a4a48" stroke-width="1" opacity="0.4"/>\
    </svg>',
    // bedroom
    '<svg viewBox="0 0 380 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\
      <rect width="380" height="380" fill="#141c1f"/>\
      <rect y="240" width="380" height="140" fill="#0f1517"/>\
      <rect x="90" y="140" width="200" height="100" rx="8" fill="#233230" opacity="0.7"/>\
      <rect x="60" y="60" width="60" height="90" fill="#2a3a38" opacity="0.5"/>\
      <rect x="270" y="70" width="50" height="80" fill="#2a3a38" opacity="0.5"/>\
      <circle cx="190" cy="90" r="40" fill="#c9a227" opacity="0.12"/>\
    </svg>',
    // hallway
    '<svg viewBox="0 0 380 380" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\
      <rect width="380" height="380" fill="#12191b"/>\
      <path d="M0 380 L150 160 L230 160 L380 380 Z" fill="#1f2b29" opacity="0.7"/>\
      <rect x="150" y="60" width="80" height="100" fill="#2a3a38" opacity="0.5"/>\
      <line x1="150" y1="160" x2="150" y2="380" stroke="#3a4a48" stroke-width="1" opacity="0.4"/>\
      <line x1="230" y1="160" x2="230" y2="380" stroke="#3a4a48" stroke-width="1" opacity="0.4"/>\
    </svg>'
  ];

  var strip = document.getElementById('dialStrip');
  if (strip) {
    var html = '';
    for (var r = 0; r < 3; r++) {
      for (var i = 0; i < roomSVGs.length; i++) {
        html += '<div class="panel">' + roomSVGs[i] + '</div>';
      }
    }
    strip.innerHTML = html;

    var dial = document.getElementById('dial');
    var panelWidth = window.innerWidth <= 960 ? 300 : 380;
    var totalSetWidth = panelWidth * roomSVGs.length;
    var offset = -totalSetWidth;
    strip.style.transform = 'translateX(' + offset + 'px)';

    var isDown = false, startX = 0, startOffset = 0;

    function clampLoop() {
      if (offset > -totalSetWidth * 0.5) offset -= totalSetWidth;
      if (offset < -totalSetWidth * 1.5) offset += totalSetWidth;
    }

    function pointerDown(x) { isDown = true; startX = x; startOffset = offset; dial.style.cursor = 'grabbing'; }
    function pointerMove(x) {
      if (!isDown) return;
      offset = startOffset + (x - startX);
      strip.style.transform = 'translateX(' + offset + 'px)';
    }
    function pointerUp() {
      isDown = false; dial.style.cursor = 'grab';
      clampLoop();
      strip.style.transform = 'translateX(' + offset + 'px)';
    }

    dial.addEventListener('mousedown',  function (e) { pointerDown(e.clientX); });
    window.addEventListener('mousemove', function (e) { pointerMove(e.clientX); });
    window.addEventListener('mouseup',  pointerUp);
    dial.addEventListener('touchstart', function (e) { pointerDown(e.touches[0].clientX); }, { passive: true });
    dial.addEventListener('touchmove',  function (e) { pointerMove(e.touches[0].clientX); }, { passive: true });
    dial.addEventListener('touchend',   pointerUp);

    // auto-drift hint on load
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      var driftFrames = 0;
      var driftInterval = setInterval(function () {
        if (isDown) return;
        offset += 0.6;
        driftFrames++;
        strip.style.transform = 'translateX(' + offset + 'px)';
        if (driftFrames > 90) { clearInterval(driftInterval); clampLoop(); strip.style.transform = 'translateX(' + offset + 'px)'; }
      }, 16);
    }

    // update panelWidth on resize
    window.addEventListener('resize', function () {
      var newWidth = window.innerWidth <= 960 ? 300 : 380;
      if (newWidth !== panelWidth) {
        panelWidth = newWidth;
        totalSetWidth = panelWidth * roomSVGs.length;
        offset = -totalSetWidth;
        strip.style.transform = 'translateX(' + offset + 'px)';
      }
    });
  }

  /* ===== 2. HAMBURGER MENU ===== */
  var hamburger = document.getElementById('hamburger');
  var mobMenu   = document.getElementById('mobMenu');
  var mobOverlay = document.getElementById('mobOverlay');
  var mobClose  = document.getElementById('mobClose');

  function openMenu() {
    mobMenu.classList.add('open');
    mobOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobMenu.classList.remove('open');
    mobOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobClose)  mobClose.addEventListener('click', closeMenu);
  if (mobOverlay) mobOverlay.addEventListener('click', closeMenu);

  // close on link click
  var mobLinks = document.querySelectorAll('.mob-nav a, .mob-cta');
  mobLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });

  /* ===== 3. FAQ ACCORDION ===== */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close all
      faqItems.forEach(function (i) {
        i.classList.remove('open');
        var b = i.querySelector('.faq-q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      // open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ===== 4. STATS COUNTER ANIMATION ===== */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var num = en.target.querySelector('.stat-num');
        if (num && !num.classList.contains('counted')) {
          num.classList.add('counted');
          animateCounter(num);
        }
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-item').forEach(function (el) {
    statsObserver.observe(el);
  });

  /* ===== 5. CLIENTS TILES REVEAL ===== */
  var clientObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        clientObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.client-tile').forEach(function (el) {
    clientObs.observe(el);
  });

  /* ===== 6. SCROLL REVEAL ===== */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObs.observe(el);
  });

  /* ===== 6. CONTACT FORM ===== */
  var form = document.getElementById('mainContactForm');
  var successMsg = document.getElementById('formSuccess');
  var submitBtn  = document.getElementById('formSubmit');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Basic validation
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e05555';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      // Simulate send (replace with real endpoint)
      submitBtn.textContent = 'جاري الإرسال...';
      submitBtn.disabled = true;
      setTimeout(function () {
        submitBtn.style.display = 'none';
        successMsg.classList.add('visible');
        form.reset();
      }, 1200);
    });
  }

})();