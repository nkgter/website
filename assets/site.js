const search = document.querySelector("#articleSearch");
const grid = document.querySelector("#articleGrid");
const resultCount = document.querySelector("#resultCount");
const seriesSelect = document.querySelector("#seriesSelect");
const categoryButtons = [...document.querySelectorAll("[data-category-filter]")];
const tagButtons = [...document.querySelectorAll("[data-tag-filter]")];
const contactPanel = document.querySelector("#contactPanel");
const contactForm = document.querySelector("#contactForm");
const contactStatus = document.querySelector("#contactStatus");

function normalize(value) {
  return (value || "").trim().toLowerCase();
}

function activeCategory() {
  return document.querySelector(".category-filters .active")?.dataset.categoryFilter || "all";
}

function activeTag() {
  return document.querySelector(".tag-filters .active")?.dataset.tagFilter || "all";
}

function applyFilters() {
  if (!grid) return;

  const category = activeCategory();
  const series = seriesSelect?.value || "all";
  const tag = activeTag();
  const terms = normalize(search?.value).split(/\s+/).filter(Boolean);
  const cards = [...grid.querySelectorAll(".article-card")];
  let visible = 0;

  for (const card of cards) {
    const categoryMatch = category === "all" || card.dataset.category === category;
    const seriesMatch = series === "all" || card.dataset.series === series;
    const tagText = card.dataset.tags || "";
    const tagMatch = tag === "all" || tagText.split(/\s+/).includes(tag);
    const searchText = normalize(card.dataset.search || card.textContent);
    const termMatch = terms.length === 0 || terms.every((term) => searchText.includes(term));
    const show = categoryMatch && seriesMatch && tagMatch && termMatch;

    card.hidden = !show;
    if (show) visible += 1;
  }

  if (resultCount) {
    resultCount.textContent = `${visible} 篇`;
  }
}

function activateButton(buttons, targetValue, datasetKey) {
  const target = buttons.find((button) => button.dataset[datasetKey] === targetValue) || buttons[0];
  if (!target) return;
  buttons.forEach((button) => button.classList.remove("active"));
  target.classList.add("active");
}

for (const button of categoryButtons) {
  button.addEventListener("click", () => {
    activateButton(categoryButtons, button.dataset.categoryFilter, "categoryFilter");
    applyFilters();
  });
}

for (const button of tagButtons) {
  button.addEventListener("click", () => {
    activateButton(tagButtons, button.dataset.tagFilter, "tagFilter");
    applyFilters();
  });
}

search?.addEventListener("input", applyFilters);
seriesSelect?.addEventListener("change", applyFilters);

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get("q");
const initialCategory = params.get("category");
const initialSeries = params.get("series");
const initialTag = params.get("tag");

if (search && initialQuery) {
  search.value = initialQuery;
}
if (initialCategory) {
  activateButton(categoryButtons, initialCategory, "categoryFilter");
}
if (seriesSelect && initialSeries) {
  seriesSelect.value = initialSeries;
}
if (initialTag) {
  activateButton(tagButtons, initialTag, "tagFilter");
}

applyFilters();

function setContactPanel(open) {
  if (!contactPanel) return;
  contactPanel.classList.toggle("open", open);
  contactPanel.setAttribute("aria-hidden", open ? "false" : "true");
}

for (const trigger of document.querySelectorAll("[data-contact-open]")) {
  trigger.addEventListener("click", () => setContactPanel(true));
}

for (const trigger of document.querySelectorAll("[data-contact-close]")) {
  trigger.addEventListener("click", () => setContactPanel(false));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setContactPanel(false);
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  if (contactStatus) {
    contactStatus.textContent = "感谢你的反馈，我们已经收到。";
  }
});
