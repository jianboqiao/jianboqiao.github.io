(function () {
  'use strict';

  var header = document.querySelector('.academic-header');
  var menuButton = document.querySelector('.academic-menu');
  var navigation = document.getElementById('academic-nav');
  var topLink = document.querySelector('.academic-top');
  var mobile = window.matchMedia('(max-width: 1279px)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!header || !menuButton || !navigation) return;

  function closeMenu(returnFocus) {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('i').className = 'fas fa-bars';
    if (returnFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) closeMenu(true);
  });
  document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) closeMenu(false);
  });
  header.addEventListener('focusout', function () {
    setTimeout(function () {
      if (!header.contains(document.activeElement)) closeMenu(false);
    }, 0);
  });
  mobile.addEventListener('change', function () { closeMenu(false); });

  var sections = Array.from(navigation.querySelectorAll('a[href*="#"]')).map(function (link) {
    var url = new URL(link.href);
    return { link: link, target: document.getElementById(decodeURIComponent(url.hash.slice(1))) };
  }).filter(function (section) { return section.target; });

  function scrollToAnchor(event, target) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu(false);
    var position = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 24;
    history.pushState(null, '', '#' + encodeURIComponent(target.id));
    window.scrollTo({ top: Math.max(0, position), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  sections.forEach(function (section) {
    section.link.addEventListener('click', function (event) { scrollToAnchor(event, section.target); });
  });
  if (topLink) {
    topLink.addEventListener('click', function (event) {
      var top = document.getElementById('top');
      if (top) scrollToAnchor(event, top);
    });
  }

  function updateScrollState() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    if (topLink) topLink.classList.toggle('is-visible', window.scrollY > 400);
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.target.getBoundingClientRect().top <= header.offsetHeight + 120) current = section;
    });
    sections.forEach(function (section) {
      if (section === current) section.link.setAttribute('aria-current', 'location');
      else section.link.removeAttribute('aria-current');
    });
  }
  var scrollPending = false;
  window.addEventListener('scroll', function () {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(function () {
      updateScrollState();
      scrollPending = false;
    });
  }, { passive: true });
  updateScrollState();

  var dialog = document.querySelector('.academic-lightbox');
  var content = document.querySelector('.academic-content');
  if (!dialog || !content || typeof dialog.showModal !== 'function') return;
  var previousTrigger = null;
  var dialogImage = dialog.querySelector('figure img');
  var caption = dialog.querySelector('figcaption');
  content.querySelectorAll('.paper-box-image img').forEach(function (image) {
    if (image.closest('a, button')) return;
    var title = image.closest('.paper-box').querySelector('.paper-box-text a');
    var paperTitle = title ? title.textContent.trim() : image.alt;
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'academic-figure-trigger';
    trigger.setAttribute('aria-label', content.dataset.imageLabel + ': ' + paperTitle);
    trigger.setAttribute('aria-haspopup', 'dialog');
    image.alt = paperTitle;
    image.parentNode.insertBefore(trigger, image);
    trigger.appendChild(image);
    trigger.addEventListener('click', function () {
      previousTrigger = trigger;
      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = paperTitle;
      caption.textContent = paperTitle;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    var bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', function () {
    dialogImage.removeAttribute('src');
    if (previousTrigger) previousTrigger.focus({ preventScroll: true });
  });
}());
