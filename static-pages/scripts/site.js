/* ===========================================
   SITE SCRIPTS
   One file, linked from every page. Each module
   feature-detects its own target elements, so it is
   safe to include this on pages that don't use a
   given module (nothing runs if the element is absent).
   =========================================== */
(function () {
  'use strict';

  // ==========================================
  // NAV — scrolled state on scroll
  // ==========================================
  (function initNavScroll() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  })();

  // ==========================================
  // NAV — mega panel hover with intent-aware switching
  // ==========================================
  (function initMegaPanels() {
    var dropdownWraps = Array.prototype.slice.call(document.querySelectorAll('.nav-dropdown-wrap'));
    if (!dropdownWraps.length) return;

    var panelCloseTimer = null;
    var panelSwitchTimer = null;
    var pendingWrap = null;
    var activeWrap = null;
    var activePanel = null;
    var mouseTrail = [];
    var PANEL_CLOSE_DELAY = 180;
    var PANEL_SWITCH_DELAY = 110;

    document.addEventListener('mousemove', function (event) {
      mouseTrail.push({ x: event.clientX, y: event.clientY });
      if (mouseTrail.length > 6) mouseTrail.shift();
    }, { passive: true });

    function clearCloseTimer() {
      clearTimeout(panelCloseTimer);
      panelCloseTimer = null;
    }

    function clearSwitchTimer() {
      clearTimeout(panelSwitchTimer);
      panelSwitchTimer = null;
      pendingWrap = null;
    }

    function closeActivePanel() {
      clearCloseTimer();
      clearSwitchTimer();
      if (!activeWrap || !activePanel) return;
      activePanel.classList.remove('open');
      activeWrap.classList.remove('panel-active');
      activeWrap = null;
      activePanel = null;
    }

    function openPanelForWrap(wrap) {
      var panel = wrap.querySelector('.mega-panel');
      if (!panel) return;
      clearCloseTimer();
      clearSwitchTimer();
      if (activeWrap === wrap) return;
      if (activePanel && activePanel !== panel) {
        activePanel.classList.remove('open');
      }
      if (activeWrap && activeWrap !== wrap) {
        activeWrap.classList.remove('panel-active');
      }
      panel.classList.add('open');
      wrap.classList.add('panel-active');
      activeWrap = wrap;
      activePanel = panel;
    }

    function pointerIsInside(rect, point) {
      return point &&
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;
    }

    function pointerIsInsideActiveRegion() {
      var point = mouseTrail[mouseTrail.length - 1];
      if (!point || !activeWrap || !activePanel) return false;
      return pointerIsInside(activeWrap.getBoundingClientRect(), point) ||
        pointerIsInside(activePanel.getBoundingClientRect(), point);
    }

    function scheduleActiveClose() {
      clearCloseTimer();
      if (!activePanel) return;
      panelCloseTimer = setTimeout(function () {
        if (!pointerIsInsideActiveRegion()) {
          closeActivePanel();
        }
      }, PANEL_CLOSE_DELAY);
    }

    function isMovingTowardActivePanel() {
      if (!activePanel || mouseTrail.length < 2) return false;
      var previousPoint = mouseTrail[mouseTrail.length - 2];
      var currentPoint = mouseTrail[mouseTrail.length - 1];
      var panelRect = activePanel.getBoundingClientRect();
      var deltaY = currentPoint.y - previousPoint.y;
      var deltaX = Math.abs(currentPoint.x - previousPoint.x);
      return currentPoint.y < panelRect.top + 24 &&
        deltaY > 2 &&
        deltaY > deltaX * 0.35;
    }

    function queuePanelSwitch(wrap) {
      clearSwitchTimer();
      pendingWrap = wrap;
      panelSwitchTimer = setTimeout(function () {
        if (pendingWrap === wrap) {
          openPanelForWrap(wrap);
        }
      }, PANEL_SWITCH_DELAY);
    }

    dropdownWraps.forEach(function (wrap) {
      var panel = wrap.querySelector('.mega-panel');
      if (!panel) return;

      wrap.addEventListener('mouseenter', function () {
        clearCloseTimer();
        if (activeWrap && activeWrap !== wrap && isMovingTowardActivePanel()) {
          queuePanelSwitch(wrap);
          return;
        }
        openPanelForWrap(wrap);
      });

      wrap.addEventListener('mouseleave', function () {
        if (pendingWrap === wrap) {
          clearSwitchTimer();
        }
        if (activeWrap === wrap) {
          scheduleActiveClose();
        }
      });

      panel.addEventListener('mouseenter', function () {
        clearCloseTimer();
        clearSwitchTimer();
      });

      panel.addEventListener('mouseleave', function () {
        if (activePanel === panel) {
          scheduleActiveClose();
        }
      });
    });
  })();

  // ==========================================
  // NAV — mobile overlay + accordion
  // ==========================================
  (function initMobileNav() {
    var mobileNav = document.getElementById('mobile-nav');
    var navOpen = document.getElementById('nav-open');
    var navClose = document.getElementById('nav-close');
    if (!mobileNav || !navOpen || !navClose) return;

    navOpen.addEventListener('click', function () {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    navClose.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.querySelectorAll('.mobile-nav-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var group = toggle.parentElement;
        document.querySelectorAll('.mobile-nav-group.open').forEach(function (g) {
          if (g !== group) g.classList.remove('open');
        });
        group.classList.toggle('open');
      });
    });
  })();

  // ==========================================
  // HERO — FLIP intro + cycling words (homepage only)
  // ==========================================
  (function initHero() {
    var heroText = document.getElementById('hero-text');
    var heroYour = document.getElementById('hero-your');
    var heroSlide = document.getElementById('hero-slide');
    var heroCycling = document.getElementById('hero-cycling');
    if (!heroText || !heroYour || !heroSlide || !heroCycling) return;

    // Fade in hero text
    setTimeout(function () {
      heroText.classList.add('visible');
    }, 200);

    // FLIP animation: slide "business" right, fade in "your"
    setTimeout(function () {
      var firstRect = heroSlide.getBoundingClientRect();
      heroYour.classList.add('in-flow');
      var lastRect = heroSlide.getBoundingClientRect();
      var dx = firstRect.left - lastRect.left;
      var dy = firstRect.top - lastRect.top;

      heroSlide.style.transition = 'none';
      heroSlide.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroSlide.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          heroSlide.style.transform = '';
          heroYour.classList.add('visible');
        });
      });
    }, 1400);

    // Cycle practice-area words
    var cyclingWords = ['business.', 'litigation.', 'real estate.', 'contracts.', 'disputes.'];
    var cyclingIndex = 0;

    function cycleWord() {
      heroCycling.style.opacity = '0';
      setTimeout(function () {
        cyclingIndex = (cyclingIndex + 1) % cyclingWords.length;
        heroCycling.textContent = cyclingWords[cyclingIndex];
        heroCycling.style.opacity = '1';
      }, 400);
    }

    setTimeout(function () {
      cycleWord();
      setInterval(cycleWord, 5000);
    }, 2800);
  })();

  // ==========================================
  // SCROLL REVEAL
  // ==========================================
  (function initScrollReveal() {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });

    // Exposed so tab switcher can re-trigger fade-in when a panel activates.
    window.__rsRefreshReveals = function (root) {
      (root || document).querySelectorAll('.reveal').forEach(function (el) {
        el.classList.remove('visible');
        revealObserver.unobserve(el);
        revealObserver.observe(el);
      });
    };
  })();

  // ==========================================
  // TEAM ROSTER — hover bio reveal
  // ==========================================
  (function initTeamRoster() {
    var teamRosterGrid = document.getElementById('team-roster-grid');
    var teamRosterDetail = document.getElementById('team-roster-detail-content');
    if (!teamRosterGrid || !teamRosterDetail) return;

    var teamBios = [
      "Kelvin co-founded the firm and leads its commercial litigation practice. He represents businesses and executives in complex disputes across Texas state and federal courts, with particular depth in breach of fiduciary duty and partnership matters.",
      "Doug co-founded the firm and focuses on business disputes, transactional litigation, and M&A-related claims. He handles matters from initial demand through trial, including injunctions and emergency relief in North Texas courts.",
      "Alex handles real estate disputes, construction litigation, and commercial property matters. His practice spans lease disputes, construction defect claims, and real estate transactional work across the DFW metroplex.",
      "Jennifer focuses on commercial litigation, including contract disputes, fraud claims, and fiduciary duty matters. She works closely with clients on case strategy and represents businesses in state and federal courts.",
      "Allison brings over 32 years of legal experience to the firm. She supports the commercial and real estate practice across multiple Texas jurisdictions.",
      "Gloria supports the firm\u2019s commercial litigation practice with a focus on client communication, case management, and legal research."
    ];
    var defaultTeamText = "Every matter is staffed with a lead attorney, supporting counsel, and a paralegal. The people who build the strategy carry it through to resolution.";
    var teamMembers = document.querySelectorAll('.team-roster-member');

    function showTeamBio(index) {
      teamMembers.forEach(function (m) { m.classList.remove('active'); });
      teamMembers[index].classList.add('active');
      teamRosterGrid.classList.add('has-active');

      teamRosterDetail.style.opacity = '0';
      setTimeout(function () {
        var p = document.createElement('p');
        p.textContent = teamBios[index];
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'team-roster-profile-link';
        link.textContent = 'Full profile ';
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 14 14');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '14');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M2 7h10M8 3l4 4-4 4');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
        link.appendChild(svg);
        teamRosterDetail.replaceChildren(p, link);
        teamRosterDetail.style.opacity = '1';
      }, 150);
    }

    function resetTeamBio() {
      teamMembers.forEach(function (m) { m.classList.remove('active'); });
      teamRosterGrid.classList.remove('has-active');
      teamRosterDetail.style.opacity = '0';
      setTimeout(function () {
        var p = document.createElement('p');
        p.textContent = defaultTeamText;
        teamRosterDetail.replaceChildren(p);
        teamRosterDetail.style.opacity = '1';
      }, 150);
    }

    teamMembers.forEach(function (member, i) {
      member.addEventListener('mouseenter', function () { showTeamBio(i); });
      member.addEventListener('click', function () { showTeamBio(i); });
    });

    teamRosterGrid.parentElement.addEventListener('mouseleave', resetTeamBio);
  })();

  // ==========================================
  // TESTIMONIAL CAROUSEL
  // ==========================================
  (function initTestimonials() {
    var slides = document.querySelectorAll('.testimonial-slide');
    var dots = document.querySelectorAll('.testimonial-dot');
    var carousel = document.getElementById('testimonial-carousel');
    if (!slides.length || !dots.length || !carousel) return;

    var currentSlide = 0;
    var autoplayTimer;

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 6000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        clearInterval(autoplayTimer);
        goToSlide(parseInt(dot.dataset.dot, 10));
        startAutoplay();
      });
    });

    carousel.addEventListener('mouseenter', function () {
      clearInterval(autoplayTimer);
    });
    carousel.addEventListener('mouseleave', function () {
      startAutoplay();
    });

    startAutoplay();
  })();

  // ==========================================
  // ABOUT MISSION — exclusive accordion
  // (fallback for browsers without <details name="">)
  // ==========================================
  (function initMissionAccordion() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.about-mission-card'));
    if (!cards.length) return;
    cards.forEach(function (card) {
      card.addEventListener('toggle', function () {
        if (!card.open) return;
        cards.forEach(function (other) {
          if (other !== card && other.open) other.open = false;
        });
      });
    });
  })();

  // ==========================================
  // ABOUT TABS — sub-navigation panel switcher
  // ==========================================
  (function initAboutTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.about-tab[data-tab]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.about-tab-panel[data-panel]'));
    if (!tabs.length || !panels.length) return;

    function activate(tabId) {
      tabs.forEach(function (tab) {
        tab.classList.toggle('is-active', tab.dataset.tab === tabId);
      });
      panels.forEach(function (panel) {
        var isActive = panel.dataset.panel === tabId;
        panel.classList.toggle('is-active', isActive);
        if (isActive && window.__rsRefreshReveals) {
          window.__rsRefreshReveals(panel);
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab.dataset.tab);
      });
    });
  })();

  // ==========================================
  // HIGHLIGHTS CAROUSEL — horizontal card slider
  // with prev/next arrows, snaps to card width.
  // ==========================================
  (function initHighlights() {
    var track = document.getElementById('highlights-track');
    var prev = document.getElementById('highlights-prev');
    var next = document.getElementById('highlights-next');
    if (!track || !prev || !next) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.highlight-card'));
    if (!cards.length) return;

    var currentIndex = 0;

    function cardStep() {
      if (cards.length < 2) return 0;
      return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    }

    function maxIndex() {
      var viewport = track.parentElement;
      if (!viewport) return 0;
      var step = cardStep();
      if (step <= 0) return 0;
      var visible = Math.max(1, Math.round(viewport.clientWidth / step));
      return Math.max(0, cards.length - visible);
    }

    function update() {
      var step = cardStep();
      track.style.transform = 'translateX(' + (-currentIndex * step) + 'px)';
      prev.disabled = currentIndex <= 0;
      next.disabled = currentIndex >= maxIndex();
    }

    prev.addEventListener('click', function () {
      if (currentIndex > 0) {
        currentIndex -= 1;
        update();
      }
    });
    next.addEventListener('click', function () {
      if (currentIndex < maxIndex()) {
        currentIndex += 1;
        update();
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        currentIndex = Math.min(currentIndex, maxIndex());
        update();
      }, 120);
    });

    update();
  })();

  // ==========================================
  // CONTACT MODAL — open/close with backdrop + ESC
  // ==========================================
  (function initContactModal() {
    var openers = Array.prototype.slice.call(document.querySelectorAll('[data-modal-open]'));
    if (!openers.length) return;
    var lastTrigger = null;

    function openModal(id) {
      var modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      var firstInput = modal.querySelector('input, textarea, button');
      if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    }

    openers.forEach(function (opener) {
      opener.addEventListener('click', function (e) {
        e.preventDefault();
        lastTrigger = opener;
        openModal(opener.dataset.modalOpen);
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(function (closer) {
      closer.addEventListener('click', function () {
        var modal = closer.closest('.contact-modal');
        closeModal(modal);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var openModalEl = document.querySelector('.contact-modal.is-open');
      if (openModalEl) closeModal(openModalEl);
    });
  })();

  // ==========================================
  // PA OVERVIEW — "Read more" toggle
  // Expands a block of supplementary body text under
  // the first intro paragraphs on practice-area overview.
  // ==========================================
  (function initPaReadMore() {
    var groups = Array.prototype.slice.call(document.querySelectorAll('.pa-readmore'));
    if (!groups.length) return;

    groups.forEach(function (group) {
      var toggle = group.querySelector('.pa-readmore-btn');
      var label = group.querySelector('.pa-readmore-label');
      if (!toggle || !label) return;

      toggle.addEventListener('click', function () {
        var isOpen = group.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        label.textContent = isOpen ? 'Show less' : 'Read more';
      });
    });
  })();

  // ==========================================
  // BIO ACCORDION — expand/collapse credentials
  // ==========================================
  (function initBioAccordion() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.bio-accordion-item'));
    if (!items.length) return;

    items.forEach(function (item) {
      var toggle = item.querySelector('.bio-accordion-toggle');
      var body = item.querySelector('.bio-accordion-body');
      if (!toggle || !body) return;

      toggle.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all others
        items.forEach(function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            other.querySelector('.bio-accordion-body').style.maxHeight = '0';
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('is-open');
          body.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  })();

})();
