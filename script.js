(() => {
  const presidioData = [
    // TODO: replace with full 44-post dataset (name, lat, lon, status1822, status1846, note).
    { name: "Tucson", province: "Sonora", foundingYear: 1775, x: 280, y: 420, status1822: "operational", status1846: "hollow", note: "Supply cycles stretched as frontier raids intensified." },
    { name: "Janos", province: "Chihuahua", foundingYear: 1686, x: 360, y: 430, status1822: "operational", status1846: "hollow", note: "A key node against Apache mobility, increasingly under-resourced." },
    { name: "Casas Grandes", province: "Chihuahua", foundingYear: 1661, x: 395, y: 445, status1822: "hollow", status1846: "abandoned", note: "Garrison persistence faded as logistics weakened." },
    { name: "San Antonio de Béxar", province: "Texas", foundingYear: 1718, x: 760, y: 405, status1822: "operational", status1846: "unresolved", note: "Political transition blurred administrative continuity." },
    { name: "Guaymas", province: "Sonora", foundingYear: 1769, x: 300, y: 520, status1822: "operational", status1846: "hollow", note: "Maritime access remained useful, but inland links strained." },
    { name: "Santa Fe", province: "Nuevo México", foundingYear: 1610, x: 470, y: 270, status1822: "operational", status1846: "hollow", note: "Distance and sparse support reduced defensive reliability." },
    { name: "El Paso del Norte", province: "Chihuahua", foundingYear: 1659, x: 520, y: 390, status1822: "operational", status1846: "hollow", note: "Crossing corridor stayed strategic as manpower thinned." },
    { name: "Tubac", province: "Sonora", foundingYear: 1752, x: 260, y: 405, status1822: "operational", status1846: "abandoned", note: "Early prominence gave way to retrenchment and vacancy." },
    { name: "Altar", province: "Sonora", foundingYear: 1770, x: 250, y: 470, status1822: "hollow", status1846: "abandoned", note: "Peripheral supply routes could not sustain a stable post." },
    { name: "Fronteras", province: "Sonora", foundingYear: 1690, x: 330, y: 395, status1822: "operational", status1846: "hollow", note: "Frequently pressured frontier line with irregular provisioning." },
    { name: "San Diego", province: "Alta California", foundingYear: 1769, x: 80, y: 330, status1822: "operational", status1846: "hollow", note: "Remote coastal outpost with stretched overland support." },
    { name: "Monterey", province: "Alta California", foundingYear: 1770, x: 90, y: 220, status1822: "operational", status1846: "unresolved", note: "Administrative center whose military condition is uneven in surviving records." }
  ];

  const statusPalette = {
    operational: { r: 127, g: 143, b: 104 },
    hollow: { r: 193, g: 154, b: 91 },
    abandoned: { r: 140, g: 59, b: 46 },
    unresolved: { r: 124, g: 111, b: 121 }
  };

  const slider = document.getElementById("year-slider");
  const yearOutput = document.getElementById("year-output");
  const presidioLayer = document.getElementById("presidio-layer");
  const cardsRoot = document.getElementById("presidio-cards");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!slider || !yearOutput || !presidioLayer || !cardsRoot) return;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const mix = (a, b, t) => Math.round(a + (b - a) * t);
  const toRgb = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`;

  function getBlend(value) {
    return clamp(Number(value) / 100, 0, 1);
  }

  function blendedColor(status1822, status1846, t) {
    const start = statusPalette[status1822] || statusPalette.unresolved;
    const end = statusPalette[status1846] || statusPalette.unresolved;
    return toRgb({
      r: mix(start.r, end.r, t),
      g: mix(start.g, end.g, t),
      b: mix(start.b, end.b, t)
    });
  }

  function blendedYear(value) {
    const t = getBlend(value);
    return Math.round(1822 + (1846 - 1822) * t);
  }

  function statusText(status) {
    switch (status) {
      case "operational": return "Operational";
      case "hollow": return "Hollow";
      case "abandoned": return "Abandoned";
      default: return "UNRESOLVED";
    }
  }

  function createMapNode(item) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("class", "p-dot");
    dot.setAttribute("cx", item.x);
    dot.setAttribute("cy", item.y);
    dot.setAttribute("r", "8");

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "p-label");
    label.setAttribute("x", item.x + 12);
    label.setAttribute("y", item.y - 9);
    label.textContent = item.name;

    group.append(dot, label);
    group.dataset.status1822 = item.status1822;
    group.dataset.status1846 = item.status1846;
    group.dataset.name = item.name;

    return group;
  }

  function renderMap() {
    presidioLayer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    presidioData.forEach((item) => fragment.appendChild(createMapNode(item)));
    presidioLayer.appendChild(fragment);
  }

  function renderCards() {
    cardsRoot.innerHTML = presidioData.map((item) => `
      <article class="p-card">
        <h3>${item.name}</h3>
        <p class="p-meta">${item.province} · Founded ${item.foundingYear}</p>
        <p class="p-status"><strong>1822:</strong> ${statusText(item.status1822)} · <strong>1846:</strong> ${statusText(item.status1846)}</p>
        <p>${item.note}</p>
      </article>
    `).join("");
  }

  function updateAtlas(value) {
    const t = getBlend(value);
    yearOutput.textContent = String(blendedYear(value));

    presidioLayer.querySelectorAll("g").forEach((group) => {
      const circle = group.querySelector("circle");
      if (!circle) return;
      const fill = blendedColor(group.dataset.status1822, group.dataset.status1846, t);
      circle.setAttribute("fill", fill);
      circle.style.opacity = String(0.88 + (t * 0.12));
    });
  }

  function setSliderByDelta(delta) {
    slider.value = String(clamp(Number(slider.value) + delta, 0, 100));
    updateAtlas(slider.value);
  }

  slider.addEventListener("input", (event) => {
    updateAtlas(event.target.value);
  });

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setSliderByDelta(-5);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setSliderByDelta(5);
    }
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".site-nav a")];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const currentId = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${currentId}`;
        link.classList.toggle("is-active", active);
      });
    });
  }, { threshold: 0.4, rootMargin: "-20% 0px -45% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));

  const revealItems = [...document.querySelectorAll(".reveal")];
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  renderMap();
  renderCards();
  updateAtlas(slider.value);
})();
