const opportunities = [
  {
    title: "Central Asia STEM Challenge",
    type: "Competition",
    category: "STEM",
    tags: ["STEM", "Science", "Kazakhstan", "Online", "grade 10"],
    detail: "Team research sprint for students building evidence-backed science projects.",
    deadline: "Jun 18",
    score: 86
  },
  {
    title: "Youth Policy Lab Fellowship",
    type: "Fellowship",
    category: "Social Impact",
    tags: ["Social Impact", "Research", "Kazakhstan", "Hybrid", "grade 10"],
    detail: "Mentored policy research program for students interested in civic projects.",
    deadline: "Jul 04",
    score: 79
  },
  {
    title: "Student Venture Sprint",
    type: "Startup Program",
    category: "Business",
    tags: ["Business", "Finance", "Online", "grade 10"],
    detail: "A short builder track for testing business ideas, pitch logic, and market research.",
    deadline: "Jul 12",
    score: 74
  },
  {
    title: "Algorithmic Thinking Summer School",
    type: "Summer School",
    category: "Programming",
    tags: ["Programming", "STEM", "Online", "Science", "grade 10"],
    detail: "Problem-solving track covering algorithms, discrete math, and contest practice.",
    deadline: "Jul 27",
    score: 82
  },
  {
    title: "Future Finance Scholars",
    type: "Scholarship",
    category: "Finance",
    tags: ["Finance", "Business", "Global", "grade 10"],
    detail: "Scholarship and mentorship program for students exploring economics and finance.",
    deadline: "Aug 03",
    score: 71
  }
];

const activeFilters = new Set(["grade 10", "STEM"]);

const searchInput = document.querySelector("#searchInput");
const resultList = document.querySelector("#resultList");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const mentorSignal = document.querySelector("#mentorSignal");
const focusSearch = document.querySelector("#focusSearch");
const resetFilters = document.querySelector("#resetFilters");
const chips = [...document.querySelectorAll(".chip")];

function normalize(value) {
  return value.trim().toLowerCase();
}

function opportunityText(opportunity) {
  return [
    opportunity.title,
    opportunity.type,
    opportunity.category,
    opportunity.detail,
    ...opportunity.tags
  ]
    .join(" ")
    .toLowerCase();
}

function matchesQuery(opportunity, query) {
  const cleaned = normalize(query);
  if (!cleaned) return true;
  return cleaned
    .split(/\s+/)
    .every((part) => opportunityText(opportunity).includes(part));
}

function matchesFilters(opportunity) {
  if (!activeFilters.size) return true;
  const tagSet = new Set(opportunity.tags.map(normalize));
  return [...activeFilters].every((filter) => tagSet.has(normalize(filter)));
}

function renderOpportunity(opportunity) {
  const tags = opportunity.tags
    .slice(0, 3)
    .map((tag) => `<span>${tag}</span>`)
    .join("");

  return `
    <article class="opportunity-row">
      <div class="opportunity-main">
        <h3>${opportunity.title}</h3>
        <p>${opportunity.detail}</p>
        <div class="opportunity-tags">${tags}</div>
      </div>
      <div class="opportunity-side">
        <strong class="match-score">${opportunity.score}%</strong>
        <span class="deadline">Deadline ${opportunity.deadline}</span>
        <div class="row-actions">
          <button type="button">Save</button>
          <button type="button">Apply</button>
        </div>
      </div>
    </article>
  `;
}

function updateMentorSignal(results) {
  if (!results.length) {
    mentorSignal.textContent = "Matched because: waiting for broader signals";
    return;
  }

  const top = results[0];
  const filters = [...activeFilters].slice(0, 2).join(" + ");
  mentorSignal.textContent = filters
    ? `Matched because: ${filters}`
    : `Matched because: ${top.category} interest`;
}

function renderResults() {
  const query = searchInput.value;
  const results = opportunities
    .filter((opportunity) => matchesQuery(opportunity, query))
    .filter(matchesFilters)
    .sort((a, b) => b.score - a.score);
  const visibleResults = results.slice(0, 1);

  resultList.innerHTML = visibleResults.map(renderOpportunity).join("");
  resultCount.textContent = `${results.length} ${results.length === 1 ? "match" : "matches"}`;
  emptyState.hidden = results.length > 0;
  updateMentorSignal(results);
}

function syncChips() {
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", activeFilters.has(chip.dataset.filter));
  });
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;
    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
    } else {
      activeFilters.add(filter);
    }

    syncChips();
    renderResults();
  });
});

searchInput.addEventListener("input", renderResults);

document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults();
});

focusSearch.addEventListener("click", () => {
  requestAnimationFrame(() => searchInput.focus());
});

resetFilters.addEventListener("click", () => {
  activeFilters.clear();
  searchInput.value = "";
  syncChips();
  renderResults();
  searchInput.focus();
});

syncChips();
renderResults();
