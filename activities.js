// ===== Activities Page Logic =====
let ACTIVITIES = [];
let ageChoices, typeChoices, categoryChoices;

document.addEventListener('DOMContentLoaded', () => {
  initChoices();
  loadActivities();
  document.getElementById('searchBar').addEventListener('input', filterActivities);
  document.getElementById('clearFilters').addEventListener('click', clearAll);
});

function initChoices() {
  ageChoices = new Choices('#ageFilter', {
    removeItemButton: true, placeholder: true,
    placeholderValue: 'Select Age Group', searchPlaceholderValue: 'Search…',
    searchEnabled: true, shouldSort: false
  });
  typeChoices = new Choices('#typeFilter', {
    removeItemButton: true, placeholder: true,
    placeholderValue: 'Select Type', searchPlaceholderValue: 'Search…',
    searchEnabled: true, shouldSort: false
  });
  categoryChoices = new Choices('#categoryFilter', {
    removeItemButton: true, placeholder: true,
    placeholderValue: 'Select Category', searchPlaceholderValue: 'Search…',
    searchEnabled: true, shouldSort: false
  });

  // Re-filter whenever any dropdown changes
  [ageChoices, typeChoices, categoryChoices].forEach(ch =>
    ch.passedElement.element.addEventListener('change', filterActivities)
  );
}

async function loadActivities() {
  try {
    const res = await fetch('activities.json'); // put activities.json in the same folder
    ACTIVITIES = await res.json();
    buildFilterOptions(ACTIVITIES);
    renderActivities(ACTIVITIES);
  } catch (e) {
    console.error('Could not load activities.json', e);
  }
}

function uniqueVals(list, key) {
  return [...new Set(list.map(x => (x[key] || '').toString().trim()).filter(Boolean))].sort();
}

function buildFilterOptions(data) {
  const ages = uniqueVals(data, 'age');
  const types = uniqueVals(data, 'type');
  const cats  = uniqueVals(data, 'category');

  ageChoices.setChoices(ages.map(v => ({ value: v, label: v })), 'value', 'label', true);
  typeChoices.setChoices(types.map(v => ({ value: v, label: v })), 'value', 'label', true);
  categoryChoices.setChoices(cats.map(v => ({ value: v, label: v })), 'value', 'label', true);
}

function currentSelections() {
  const searchTerm = document.getElementById('searchBar').value.trim().toLowerCase();
  const ages = ageChoices.getValue(true);
  const types = typeChoices.getValue(true);
  const cats  = categoryChoices.getValue(true);
  return { searchTerm, ages, types, cats };
}

function filterActivities() {
  const { searchTerm, ages, types, cats } = currentSelections();

  const list = ACTIVITIES.filter(a => {
    // Combine fields for text search
    const hay = [
      a.name, a.description, a.type, a.category, a.age, a.location, a.tags
    ].join(' ').toLowerCase();

    const passSearch = searchTerm ? hay.includes(searchTerm) : true;

    const inAges  = !ages.length  || ages.some(v  => (a.age || '').includes(v));
    const inTypes = !types.length || types.some(v => (a.type || '').includes(v));
    const inCats  = !cats.length  || cats.some(v  => (a.category || '').includes(v));

    return passSearch && inAges && inTypes && inCats;
  });

  renderActivities(list);
}

function renderActivities(list) {
  const grid = document.getElementById('activityGrid');
  if (!list.length) {
    grid.innerHTML = `<div class="activity-card"><p>No activities found. Try clearing filters.</p></div>`;
    return;
  }

  grid.innerHTML = list.map(item => {
    const tags = (item.tags || '')
      .toString()
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => `<span class="tag">${t}</span>`)
      .join('');

    return `
      <article class="activity-card" role="listitem">
        <h3>${escapeHtml(item.name || 'Untitled')}</h3>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
        <div class="kv">
          <div><strong>Age:</strong> ${escapeHtml(item.age || '—')}</div>
          <div><strong>Type:</strong> ${escapeHtml(item.type || '—')}</div>
          <div><strong>Category:</strong> ${escapeHtml(item.category || '—')}</div>
        </div>
        ${tags ? `<div class="tags">${tags}</div>` : ''}
        <div class="card-actions">
          ${item.link ? `<a class="btn" href="${escapeAttr(item.link)}" target="_blank" rel="noopener">Learn more</a>` : ''}
        </div>
      </article>
    `;
  }).join('');
}

function clearAll() {
  document.getElementById('searchBar').value = '';
  ageChoices.clearStore(); typeChoices.clearStore(); categoryChoices.clearStore();
  buildFilterOptions(ACTIVITIES);
  renderActivities(ACTIVITIES);
}

// Basic escaping to avoid breaking HTML when rendering data
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function escapeAttr(str){
  return String(str).replace(/"/g,'&quot;');
}
