(function () {
  'use strict';

  var content = document.querySelector('.academic-content');

  // Adapt rendered Markdown to upstream component classes without changing source files.
  function enhanceContent() {
    var root = content && content.querySelector('[itemprop="text"]');
    if (!root) return;
    var section;
    Array.from(root.children).forEach(function (element) {
      var anchor = element.querySelector(':scope > .anchor[id]');
      if (anchor) {
        section = document.createElement('section');
        section.dataset.section = anchor.id;
        if (anchor.id === 'about-me') section.className = 'about';
        if (anchor.id === 'education' || anchor.id === 'honors') section.className = 'academic-section';
        root.insertBefore(section, element);
      }
      if (section) section.appendChild(element);
      if (element.tagName === 'H1') element.classList.add('card-title');
      if (section && section.classList.contains('about') && !anchor) element.classList.add('intro-text');
    });

    var news = root.querySelector('[data-section="news"] ul');
    if (news) {
      news.classList.add('news-list');
      Array.from(news.children).forEach(function (item) {
        var date = item.querySelector(':scope > em');
        if (!date) return;
        date.classList.add('news-time');
        var copy = document.createElement('span');
        copy.className = 'news-content';
        while (date.nextSibling) copy.appendChild(date.nextSibling);
        item.appendChild(copy);
      });
    }

    ['education', 'honors'].forEach(function (id) {
      var list = root.querySelector('[data-section="' + id + '"] ul');
      if (!list) return;
      list.classList.add('academic-list', id === 'education' ? 'education-path' : 'awards-list');
      Array.from(list.children).forEach(function (item) {
        item.classList.add('academic-item');
        var details = document.createElement('div');
        details.className = 'academic-details';
        while (item.firstChild) details.appendChild(item.firstChild);
        var emblem = document.createElement('span');
        emblem.className = id === 'education' ? 'school-emblem' : 'honor-emblem';
        emblem.setAttribute('aria-hidden', 'true');
        var icon = document.createElement('i');
        icon.className = id === 'education' ? 'fas fa-university' : 'fas fa-award';
        emblem.appendChild(icon);
        item.append(emblem, details);
      });
    });

    function formatPaper(card, text, badge) {
      var paragraph = text.querySelector('p') || text;
      var titleLink = paragraph.querySelector('a');
      var lineBreak = paragraph.querySelector('br');
      if (!titleLink || !lineBreak) return;
      var title = document.createElement('h3');
      title.className = 'publication-title';
      var titleRange = document.createRange();
      titleRange.setStartBefore(titleLink);
      titleRange.setEndBefore(lineBreak);
      title.appendChild(titleRange.extractContents());
      lineBreak.remove();
      var authors = document.createElement('div');
      authors.className = 'publication-authors';
      while (text.firstChild) authors.appendChild(text.firstChild);
      var authorRow = document.createElement('div');
      authorRow.className = 'publication-author-row';
      authorRow.appendChild(authors);
      card.classList.add('publication-card');
      text.classList.add('publication-content');
      if (badge) {
        var venue = document.createElement('div');
        venue.className = 'publication-venue';
        badge.classList.add('venue-tag');
        venue.appendChild(badge);
        text.appendChild(venue);
      }
      text.append(title, authorRow);
    }

    var publications = root.querySelector('[data-section="publications"]');
    if (!publications) return;
    var papers = Array.from(publications.querySelectorAll('.paper-box'));
    if (papers.length) {
      var illustrated;
      papers.forEach(function (paper) {
        var text = paper.querySelector('.paper-box-text');
        if (!text) return;
        if (!illustrated || paper.previousElementSibling !== illustrated) {
          illustrated = document.createElement('div');
          illustrated.className = 'publications-list';
          paper.before(illustrated);
        }
        formatPaper(paper, text, paper.querySelector('.badge'));
        var image = paper.querySelector('.paper-box-image img');
        if (image) image.classList.add('publication-image');
        illustrated.appendChild(paper);
      });
    }
    publications.querySelectorAll('ul').forEach(function (list) {
      list.classList.add('publications-list');
      Array.from(list.children).forEach(function (item) {
        if (!item.querySelector('a') || !item.querySelector('br')) return;
        var text = document.createElement('div');
        while (item.firstChild) text.appendChild(item.firstChild);
        item.appendChild(text);
        item.classList.add('publication-card--text-only');
        formatPaper(item, text);
      });
    });
  }
  enhanceContent();

  var header = document.querySelector('.academic-header');
  var headerBar = document.querySelector('.header-container');
  var menuButton = document.querySelector('.academic-menu');
  var navigation = document.getElementById('academic-nav');
  var topLink = document.querySelector('.academic-top');
  var mobile = window.matchMedia('(max-width: 1240px)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!header || !menuButton || !navigation) return;

  function closeMenu(returnFocus) {
    header.classList.remove('menu-open');
    navigation.classList.remove('show');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('i').className = 'fas fa-bars';
    if (returnFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    navigation.classList.toggle('show', open);
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
    var position = target.getBoundingClientRect().top + window.scrollY - headerBar.offsetHeight - 24;
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
      if (section.target.getBoundingClientRect().top <= headerBar.offsetHeight + 120) current = section;
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
