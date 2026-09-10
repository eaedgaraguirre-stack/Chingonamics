(function () {
  const root = document.getElementById("chingonomics-index");
  if (!root) return;

  const grid = root.querySelector(".cx-grid");
  const filters = root.querySelectorAll("[data-tier]");
  let entries = [];
  let active = "all";

  function scoreOf(e) {
    const w = {
      cultural_heat: 0.35,
      economic_signal: 0.3,
      authenticity: 0.2,
      engagement_potential: 0.15
    };
    const s = e.scores || {};
    return Math.round(
      (s.cultural_heat || 0) * w.cultural_heat +
      (s.economic_signal || 0) * w.economic_signal +
      (s.authenticity || 0) * w.authenticity +
      (s.engagement_potential || 0) * w.engagement_potential
    );
  }

  function render() {
    const list = entries
      .filter((e) => active === "all" || e.tier === active)
      .sort((a, b) => scoreOf(b) - scoreOf(a));

    grid.innerHTML = list
      .map(
        (e) => `
      <article class="cx-card">
        <div class="cx-tier">${e.tier}</div>
        <h3>${e.name}</h3>
        <div class="cx-score">${scoreOf(e)}</div>
        <p class="cx-note">${e.note || ""}</p>
      </article>`
      )
      .join("");
  }

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      active = btn.getAttribute("data-tier");
      filters.forEach((b) => b.classList.toggle("is-on", b === btn));
      render();
    });
  });

  fetch("data/index.json")
    .then((r) => r.json())
    .then((data) => {
      entries = data.entries || [];
      render();
    })
    .catch(() => {
      grid.innerHTML = "<p>Index loading failed.</p>";
    });
})();
