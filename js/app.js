/* ===========================================================
   REQUESTS BY COLART — directory logic
   Renders cards + filter chips from js/items.js, wires up
   search, the "/" focus shortcut, and the live result count.
=============================================================== */
(function () {
  "use strict";

  var ACCENT_VARS = ["--purple", "--magenta", "--teal", "--mint", "--lime"];

  var items = (window.KR_ITEMS || []).map(function (item, i) {
    return Object.assign({}, item, { accentVar: ACCENT_VARS[i % ACCENT_VARS.length] });
  });

  var grid = document.getElementById("cardsGrid");
  var chipsWrap = document.getElementById("filterChips");
  var searchInput = document.getElementById("searchInput");
  var countEl = document.getElementById("searchCount");
  var emptyState = document.getElementById("emptyState");

  if (!grid || !items.length) return;

  var activeCategory = "All";
  var query = "";

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (w) { return w.charAt(0); })
      .join("")
      .toUpperCase();
  }

  function arrowIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }

  function buildCard(item) {
    var a = document.createElement("a");
    a.className = "card";
    a.href = "/" + item.slug;
    a.style.setProperty("--ring-color", "var(" + item.accentVar + ")");

    var avatarInner = document.createElement("div");
    avatarInner.className = "card-avatar-inner";

    if (item.logo) {
      var img = document.createElement("img");
      img.src = item.logo;
      img.alt = "";
      img.loading = "lazy";
      img.addEventListener("error", function () {
        avatarInner.innerHTML = '<span class="card-avatar-initials">' + initials(item.name) + "</span>";
      });
      avatarInner.appendChild(img);
    } else {
      avatarInner.innerHTML = '<span class="card-avatar-initials">' + initials(item.name) + "</span>";
    }

    a.innerHTML =
      '<div class="card-connector"><span class="dot"></span><span class="line"></span><span class="dot"></span></div>' +
      '<div class="card-avatar"></div>' +
      '<div class="card-body">' +
        '<span class="card-category">' + item.category + "</span>" +
        '<div class="card-name">' + item.name + "</div>" +
        (item.location ? '<div class="card-location">' + item.location + "</div>" : "") +
      "</div>" +
      '<div class="card-arrow">' + arrowIcon() + "</div>";

    a.querySelector(".card-avatar").appendChild(avatarInner);
    return a;
  }

  function buildChips() {
    var seen = [];
    items.forEach(function (item) {
      if (seen.indexOf(item.category) === -1) seen.push(item.category);
    });
    var categories = ["All"].concat(seen);

    chipsWrap.innerHTML = "";
    categories.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (cat === activeCategory ? " is-active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function () {
        activeCategory = cat;
        Array.prototype.forEach.call(chipsWrap.children, function (c) {
          c.classList.toggle("is-active", c === btn);
        });
        render();
      });
      chipsWrap.appendChild(btn);
    });
  }

  function filteredItems() {
    var q = query.trim().toLowerCase();
    return items.filter(function (item) {
      var matchesCategory = activeCategory === "All" || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      var haystack = (item.name + " " + item.category + " " + (item.location || "")).toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function render() {
    var results = filteredItems();
    grid.innerHTML = "";
    results.forEach(function (item) { grid.appendChild(buildCard(item)); });

    if (emptyState) emptyState.classList.toggle("is-visible", results.length === 0);

    if (countEl) {
      var noun = items.length === 1 ? "venue" : "venues";
      countEl.innerHTML = "Showing <strong>" + results.length + "</strong> of <strong>" + items.length + "</strong> " + noun;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      query = e.target.value;
      render();
    });
  }

  // "/" focuses search, unless the user is already typing in a field
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || !searchInput) return;
    var active = document.activeElement;
    var tag = active ? active.tagName : "";
    var isEditable = tag === "INPUT" || tag === "TEXTAREA" || (active && active.isContentEditable);
    if (isEditable) return;
    e.preventDefault();
    searchInput.focus();
  });

  buildChips();
  render();

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
