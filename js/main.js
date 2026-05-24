window.addEventListener('load', () => {
  initTheme();
  initLangToggle();
  applyTranslations();
  initDT();

  const repo = getRepoFromUrl();

  if (repo) {
    document.getElementById('q').value = repo;
    fetchData();
  }
});

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  fetchData();
});

// --- Theme System ---

function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return 'auto';
}

function getEffectiveTheme(theme) {
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  const effective = getEffectiveTheme(theme);
  document.body.setAttribute('data-bs-theme', effective);
  updateThemeIcon(theme);
  updateThemeMenuActive(theme);
}

function updateThemeIcon(theme) {
  const iconEl = document.getElementById('theme-icon');
  if (!iconEl) return;
  const icons = { light: '☀️', dark: '🌙', auto: '🖥️' };
  iconEl.textContent = icons[theme] || '🌓';
}

function updateThemeMenuActive(theme) {
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
  });
}

function initTheme() {
  const theme = getPreferredTheme();
  setTheme(theme);

  // Listen for OS theme changes when in auto mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'auto') {
      document.body.setAttribute('data-bs-theme', getEffectiveTheme('auto'));
    }
  });

  // Theme dropdown items
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.getAttribute('data-theme'));
    });
  });
}

// --- Language Toggle ---

function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  updateLangButton(btn);
  btn.addEventListener('click', () => {
    const current = getLanguage();
    const next = current === 'en' ? 'tr' : 'en';
    setLanguage(next);
    updateLangButton(btn);
    rebuildDTColumns();
  });
}

function updateLangButton(btn) {
  const lang = getLanguage();
  btn.textContent = lang.toUpperCase();
}

// --- DataTable ---

function fetchData() {
  const repo = document.getElementById('q').value.replaceAll(' ','');
  const re = /[-_\w]+\/[-_.\w]+/;

  const urlRepo = getRepoFromUrl();

  if (!urlRepo || urlRepo !== repo) {
    window.history.pushState('', '', `#${repo}`);
  }

  if (re.test(repo)) {
    fetchAndShow(repo);
  } else {
    showMsg(
      t('errorInvalid'),
      'danger'
    );
  }
}

function updateDT(data) {
  // Remove any alerts, if any:
  if ($('.alert')) $('.alert').remove();

  // Format dataset and redraw DataTable. Use second index for key name
  const forks = [];
  for (let fork of data) {
    fork.repoLink = `<a href="https://github.com/${fork.full_name}">${t('colLink')}</a>`;
    fork.ownerName = `<img src="${fork.owner.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}&s=48" width="24" height="24" class="me-2 rounded-circle" />${fork.owner ? fork.owner.login : '<strike><em>Unknown</em></strike>'}`;
    forks.push(fork);
  }
  const dataSet = forks.map(fork =>
    window.columnNamesMap.map(colNM => fork[colNM[1]])
  );
  window.forkTable
    .clear()
    .rows.add(dataSet)
    .draw();
  makeTableKeyboardScrollable();
}

// Will replace with JavaScript Temporal once supported in major browsers
function howLongAgo(date) {
  const lang = getLanguage();
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const relTime = new Intl.RelativeTimeFormat(locale, { style: 'long' });
  if(!date) return 'Unknown';

  const startDateMilliseconds = Date.parse(date);
  const endDateMilliseconds = Date.parse(new Date());

  const elapsedSeconds = (endDateMilliseconds - startDateMilliseconds) / 1000;
  const elapsedHours = elapsedSeconds / 60 / 60;
  const elapsedDays = elapsedHours / 24;
  const elapsedMonths = elapsedDays / 30;
  const elapsedYears = elapsedDays / 365.25;

  if(elapsedHours < 24)
    return relTime.format(-Math.floor(elapsedHours), 'hour');
  if(elapsedDays < 31)
    return relTime.format(-Math.floor(elapsedDays), 'day');
  if(elapsedMonths < 12)
    return relTime.format(-Math.floor(elapsedMonths), 'month');
  return relTime.format(-Math.floor(elapsedYears), 'year');
}

function getColumnNamesMap() {
  return [
    [t('colLink'), 'repoLink'],
    [t('colOwner'), 'ownerName'],
    [t('colName'), 'name'],
    [t('colBranch'), 'default_branch'],
    [t('colStars'), 'stargazers_count'],
    [t('colForks'), 'forks'],
    [t('colIssues'), 'open_issues_count'],
    [t('colSize'), 'size'],
    [t('colLastPush'), 'pushed_at'],
  ];
}

function initDT() {
  window.columnNamesMap = getColumnNamesMap();

  // Sort by stars:
  const sortColName = t('colStars');
  const sortColumnIdx = window.columnNamesMap
    .map(pair => pair[0])
    .indexOf(sortColName);

  // Use first index for readable column name
  window.forkTable = $('#forkTable').DataTable({
    columns: window.columnNamesMap.map(colNM => {
      return {
        title: colNM[0],
        render:
          colNM[1] === 'pushed_at'
            ? (data, type, _row) => {
                if (type === 'display') {
                  return howLongAgo(data);
                }
                return data;
              }
            : null,
      };
    }),
    order: [[sortColumnIdx, 'desc']],
    // paging: false,
    searchBuilder:{
      // all options at default
    }
  });
  let table = window.forkTable;
  new $.fn.dataTable.SearchBuilder(table, {});
  table.searchBuilder.container().prependTo(table.table().container());
  makeTableKeyboardScrollable();
}

function rebuildDTColumns() {
  if (!window.forkTable) return;

  // Save current data
  const currentData = window.forkTable.rows().data().toArray();

  // Destroy existing table
  window.forkTable.destroy();
  $('#forkTable').empty();

  // Re-initialize with new language
  initDT();

  // Re-add data if any existed
  if (currentData.length > 0) {
    window.forkTable.rows.add(currentData).draw();
    makeTableKeyboardScrollable();
  }
}

function fetchAndShow(repo) {
  repo = repo.replace('https://github.com/', '');
  repo = repo.replace('http://github.com/', '');
  repo = repo.replace(/\.git$/, '');
  repo = repo.replace(/^\s+/, ''); // remove leading whitespace
  repo = repo.replace(/\s+$/, ''); // remove trailing whitespace
  repo = repo.replace(/^\/+/, ''); // remove leading slashes
  repo = repo.replace(/\/+$/, ''); // remove trailing slashes

  fetch(
    `https://api.github.com/repos/${repo}/forks?sort=stargazers&per_page=100`
  )
    .then(response => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then(data => {
      updateDT(data);
    })
    .catch(error => {
      const msg =
        error.toString().indexOf('Forbidden') >= 0
          ? t('errorRateLimit')
          : error;
      showMsg(`${msg}. Additional info in console`, 'danger');
      console.error(error);
    });
}

function showMsg(msg, type) {
  let alert_type = 'alert-info';

  if (type === 'danger') {
    alert_type = 'alert-danger';
  }

  document.getElementById('footer').innerHTML = '';

  document.getElementById('data-body').innerHTML = `
        <div class="alert ${alert_type} alert-dismissible fade show" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            ${msg}
        </div>
    `;
}

function getRepoFromUrl() {
  const urlRepo = location.hash && location.hash.slice(1);

  return urlRepo && decodeURIComponent(urlRepo);
}

function makeTableKeyboardScrollable() {
  const tableContainer = document.querySelector('.dt-layout-full');
  tableContainer.setAttribute('aria-labelledby', 'table-container-label');
  tableContainer.setAttribute('role', 'region');
  tableContainer.setAttribute('tabindex', '0');
  tableContainer.classList.add('table-responsive');
}