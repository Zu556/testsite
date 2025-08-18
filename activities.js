// activities.js

async function loadData() {
  const response = await fetch("https://zu556.github.io/testsite/activities.json");
  const data = await response.json();
  return data;
}

function populateFilters(data) {
  const categorySelect = document.getElementById("categoryFilter");
  const ageGroupSelect = document.getElementById("ageGroupFilter");
  const locationSelect = document.getElementById("locationFilter");
  const languageSelect = document.getElementById("languageFilter");

  // Create a helper to populate a select
  function addOptions(select, values) {
    select.innerHTML = '<option value="">All</option>'; // default option
    values.forEach(v => {
      if (v) { // skip empty/null
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v;
        select.appendChild(option);
      }
    });
  }

  // Extract unique values from JSON
  const categories = [...new Set(data.map(item => item.Category))];
  const ageGroups = [...new Set(data.map(item => item.AgeGroup))];
  const locations = [...new Set(data.map(item => item.Location))];
  const languages = [...new Set(data.map(item => item.Language))];

  addOptions(categorySelect, categories);
  addOptions(ageGroupSelect, ageGroups);
  addOptions(locationSelect, locations);
  addOptions(languageSelect, languages);
}

function renderActivities(data) {
  const grid = document.getElementById("activityGrid");
  grid.innerHTML = "";

  if (!data || data.length === 0) {
    grid.innerHTML = "<p>No activities match your filters.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    card.innerHTML = `
      <h3>${item.Title}</h3>
      <p><strong>Category:</strong> ${item.Category}</p>
      <p><strong>Age Group:</strong> ${item.AgeGroup}</p>
      <p><strong>Language:</strong> ${item.Language}</p>
      <p><strong>Location:</strong> ${item.Location}</p>
      <p><strong>Description:</strong> ${item.Description}</p>
      <p><strong>How to Apply:</strong> ${item.HowToApply}</p>
      ${item.Link1 ? `<a href="${item.Link1}" target="_blank">More Info</a>` : ""}
      ${item.Link2 ? `<a href="${item.Link2}" target="_blank">Extra Link</a>` : ""}
    `;

    grid.appendChild(card);
  });
}

function applyFilters(data) {
  const category = document.getElementById("categoryFilter").value;
  const ageGroup = document.getElementById("ageGroupFilter").value;
  const location = document.getElementById("locationFilter").value;
  const language = document.getElementById("languageFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  const filtered = data.filter(item => {
    return (
      (!category || item.Category === category) &&
      (!ageGroup || item.AgeGroup === ageGroup) &&
      (!location || item.Location === location) &&
      (!language || item.Language === language) &&
      (!search ||
        (item.Title && item.Title.toLowerCase().includes(search)) ||
        (item.Description && item.Description.toLowerCase().includes(search)))
    );
  });

  renderActivities(filtered);
}

async function init() {
  const data = await loadData();

  populateFilters(data);
  renderActivities(data);

  document.getElementById("categoryFilter").addEventListener("change", () => applyFilters(data));
  document.getElementById("ageGroupFilter").addEventListener("change", () => applyFilters(data));
  document.getElementById("locationFilter").addEventListener("change", () => applyFilters(data));
  document.getElementById("languageFilter").addEventListener("change", () => applyFilters(data));
  document.getElementById("searchInput").addEventListener("input", () => applyFilters(data));
}

init();
