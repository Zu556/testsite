// activities.js

// Load JSON dataset directly from GitHub
async function loadData() {
  const response = await fetch("https://raw.githubusercontent.com/Zu556/testsite/269354d1868a186b4d3f7a8f7e80c89bed414d38/activities.json");
  const data = await response.json();
  return data;
}

// Render filter options dynamically
function populateFilters(data) {
  const categories = [...new Set(data.map(item => item.Category).filter(Boolean))];
  const ageGroups = [...new Set(data.map(item => item.AgeGroup).filter(Boolean))];
  const locations = [...new Set(data.map(item => item.Location).filter(Boolean))];
  const languages = [...new Set(data.map(item => item.Language).filter(Boolean))];

  const categorySelect = document.getElementById("categoryFilter");
  const ageGroupSelect = document.getElementById("ageGroupFilter");
  const locationSelect = document.getElementById("locationFilter");
  const languageSelect = document.getElementById("languageFilter");

  categories.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    categorySelect.appendChild(option);
  });

  ageGroups.forEach(a => {
    const option = document.createElement("option");
    option.value = a;
    option.textContent = a;
    ageGroupSelect.appendChild(option);
  });

  locations.forEach(l => {
    const option = document.createElement("option");
    option.value = l;
    option.textContent = l;
    locationSelect.appendChild(option);
  });

  languages.forEach(l => {
    const option = document.createElement("option");
    option.value = l;
    option.textContent = l;
    languageSelect.appendChild(option);
  });
}

// Render activity cards
function renderActivities(data) {
  const grid = document.getElementById("activityGrid");
  grid.innerHTML = "";

  if (data.length === 0) {
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

// Apply filters
function applyFilters(data) {
  const category = document.getElementById("categoryFilter").value;
  const ageGroup = document.getElementById("ageGroupFilter").value;
  const location = document.getElementById("locationFilter").value;
  const language = document.getElementById("languageFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  const filtered = data.filter(item => {
    return (
      (category === "" || item.Category.includes(category)) &&
      (ageGroup === "" || item.AgeGroup.includes(ageGroup)) &&
      (location === "" || item.Location.includes(location)) &&
      (language === "" || item.Language.includes(language)) &&
      (search === "" ||
        item.Title.toLowerCase().includes(search) ||
        item.Description.toLowerCase().includes(search))
    );
  });

  renderActivities(filtered);
}

// Initialize page
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
