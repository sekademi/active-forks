document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFontSize();
  initLangToggle();
  applyTranslations();
  initDT();

  // Handle click on the example repo text in search label
  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'example-repo') {
      const qInput = document.getElementById('q');
      if (qInput) {
        qInput.value = 'techgaun/active-forks';
        fetchData();
      }
    }
  });

  // Handle click on the filter toggle button
  const filterToggle = document.getElementById('filter-toggle');
  if (filterToggle) {
    filterToggle.addEventListener('click', () => {
      const sb = document.querySelector('.dtsb-searchBuilder');
      if (sb) {
        sb.classList.toggle('dtsb-collapsed');
      }
    });
  }

  // Handle click on the reset settings button
  const resetSettingsBtn = document.getElementById('reset-settings');
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem('theme');
        localStorage.removeItem('font_size_preference');
        localStorage.removeItem('lang');
        localStorage.removeItem('dt_page_length');
        sessionStorage.setItem('show_reset_toast', 'true');
      } catch (e) {
        console.error('localStorage access denied:', e);
      }
      location.reload();
    });
  }

  const repo = getRepoFromUrl();

  if (repo) {
    document.getElementById('q').value = repo;
    fetchData();
  }

  const exportCsvBtn = document.getElementById('export-csv');
  if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportCSV);

  const exportJsonBtn = document.getElementById('export-json');
  if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJSON);

  // Check if we should show the reset settings toast
  try {
    if (sessionStorage.getItem('show_reset_toast') === 'true') {
      sessionStorage.removeItem('show_reset_toast');
      setTimeout(() => {
        showToast(t('toastSettingsReset'));
      }, 300);
    }
  } catch (e) {
    console.error('sessionStorage access denied:', e);
  }

  // Fetch initial rate limit
  fetchRateLimit();

  // Set up rate limit tooltip hover listener
  const rateLimitContainer = document.getElementById('rate-limit-container');
  if (rateLimitContainer) {
    rateLimitContainer.addEventListener('mouseenter', () => {
      if (window.currentResetTimestamp) {
        const secondsLeft = window.currentResetTimestamp - Math.floor(Date.now() / 1000);
        const minutesLeft = Math.max(0, Math.ceil(secondsLeft / 60));
        let timeStr = '';
        if (minutesLeft > 0) {
          timeStr = `${minutesLeft} ${t('minutes')}`;
        } else {
          const secs = Math.max(0, secondsLeft);
          timeStr = `${secs} ${t('seconds')}`;
        }
        const tooltipTemplate = t('rateLimitTooltip');
        rateLimitContainer.setAttribute('title', tooltipTemplate.replace('{time}', timeStr));
      }
    });
  }
});

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  fetchData();
});

// --- Theme System ---

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
  } catch (e) {
    console.error('localStorage access denied:', e);
  }
  return 'auto';
}

function getEffectiveTheme(theme) {
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function setTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    console.error('localStorage access denied:', e);
  }
  const effective = getEffectiveTheme(theme);
  document.documentElement.setAttribute('data-bs-theme', effective);
  updateThemeIcon(theme);
  updateThemeMenuActive(theme);
}

function updateThemeIcon(theme) {
  const iconEl = document.getElementById('theme-icon');
  if (!iconEl) return;
  iconEl.className = 'fa-solid'; // Reset to base FontAwesome class
  if (theme === 'light') {
    iconEl.classList.add('fa-sun');
  } else if (theme === 'dark') {
    iconEl.classList.add('fa-moon');
  } else {
    iconEl.classList.add('fa-circle-half-stroke');
  }
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
    try {
      if (localStorage.getItem('theme') === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', getEffectiveTheme('auto'));
      }
    } catch (e) {
      document.documentElement.setAttribute('data-bs-theme', getEffectiveTheme('auto'));
    }
  });

  // Theme dropdown items
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.getAttribute('data-theme'));
      showToast(t('toastThemeUpdated'));
    });
  });
}

// --- Font Size System ---

function getPreferredFontSize() {
  try {
    const stored = localStorage.getItem('font_size_preference');
    if (stored) return stored;
  } catch (e) {
    console.error('localStorage access denied:', e);
  }
  return 'normal';
}

function setFontSize(size) {
  try {
    localStorage.setItem('font_size_preference', size);
  } catch (e) {
    console.error('localStorage access denied:', e);
  }

  let scale = '100%';
  if (size === 'small') scale = '90%';
  if (size === 'large') scale = '120%';
  if (size === 'xlarge') scale = '145%';

  document.documentElement.style.fontSize = scale;
  updateFontSizeMenuActive(size);
}

function updateFontSizeMenuActive(size) {
  document.querySelectorAll('[data-font-size]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-font-size') === size);
  });
}

function initFontSize() {
  const size = getPreferredFontSize();
  setFontSize(size);

  document.querySelectorAll('[data-font-size]').forEach(btn => {
    btn.addEventListener('click', () => {
      setFontSize(btn.getAttribute('data-font-size'));
      showToast(t('toastFontSizeUpdated'));
    });
  });
}

// --- Language Toggle ---

function initLangToggle() {
  updateLangButton();

  // Add click listeners to language dropdown items
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
      updateLangButton();
      rebuildDTColumns();
      showToast(t('toastLangUpdated'));
    });
  });
}

function updateLangButton() {
  const current = getLanguage();
  const currentSpan = document.getElementById('lang-current');
  if (currentSpan) {
    currentSpan.textContent = current.toUpperCase();
  }

  // Update active class in language menu
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === current);
  });
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
  window.latestForks = data || [];

  // Remove any alerts, if any:
  if ($('.alert')) $('.alert').remove();

  // Format dataset and redraw DataTable. Use second index for key name
  const dataSet = mapForksToDataTableRows(data || []);
  window.forkTable
    .clear()
    .rows.add(dataSet)
    .draw();
  makeTableKeyboardScrollable();
}

function renderForkPages(pageMap) {
  const pages = Object.keys(pageMap)
    .map(page => parseInt(page, 10))
    .sort((a, b) => a - b)
    .flatMap(page => pageMap[page] || []);
  updateDT(pages);
}

function appendDT(data) {
  if (!Array.isArray(data) || data.length === 0) return;

  window.latestForks.push(...data);
  const dataSet = mapForksToDataTableRows(data);
  window.forkTable
    .rows.add(dataSet)
    .draw(false);
  makeTableKeyboardScrollable();
}

function mapForksToDataTableRows(forks) {
  return (forks || []).map(fork => {
    fork.repoLink = fork.full_name;
    fork.ownerName = `<img src="${fork.owner.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}&s=48" width="24" height="24" class="me-2 rounded-circle" />${fork.owner ? fork.owner.login : '<strike><em>Unknown</em></strike>'}`;
    return window.columnNamesMap.map(colNM => fork[colNM[1]]);
  });
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

  // Retrieve page length preference from localStorage
  let savedLength = 100;
  try {
    const stored = localStorage.getItem('dt_page_length');
    if (stored) savedLength = parseInt(stored, 10);
  } catch (e) {
    console.error('localStorage access denied:', e);
  }

  // Use first index for readable column name
  window.forkTable = $('#forkTable').DataTable({
    pageLength: savedLength,
    columns: window.columnNamesMap.map(colNM => {
      return {
        title: colNM[0],
        render: (data, type, _row) => {
          if (colNM[1] === 'pushed_at') {
            if (type === 'display') {
              return howLongAgo(data);
            }
            return data;
          }
          if (colNM[1] === 'repoLink') {
            if (type === 'display') {
              return `<a href="https://github.com/${data}">${t('colLink')}</a>`;
            }
            return data;
          }
          return data;
        },
      };
    }),
    order: [[sortColumnIdx, 'desc']],
    // paging: false,
    searchBuilder:{
      // all options at default
    }
  });

  // Listen to page length change and save preference
  $('#forkTable').on('length.dt', (e, settings, len) => {
    try {
      const oldLen = localStorage.getItem('dt_page_length');
      if (oldLen !== String(len)) {
        localStorage.setItem('dt_page_length', len);
        showToast(t('toastPageLengthUpdated'));
      }
    } catch (err) {
      console.error('localStorage access denied:', err);
    }
  });

  let table = window.forkTable;
  const sbContainer = table.searchBuilder.container();
  sbContainer.prependTo(table.table().container());
  sbContainer.addClass('dtsb-collapsed');
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

  setLoading(true);
  window.latestForks = [];
  window.forkTable.clear().draw();

  const pageMap = {};
  const renderPage = (pageData, page) => {
    if (!Array.isArray(pageData) || pageData.length === 0) return;
    pageMap[page] = pageData;
    renderForkPages(pageMap);
  };

  const nextPage = loadCachedPages(repo, (pageData, page) => {
    renderPage(pageData, page);
  });

  fetchRateLimitData()
    .then(core => {
      if (core && core.remaining !== null && core.limit !== null) {
        updateRateLimitUI(core.remaining, core.limit, core.reset);
      }
      if (core && core.remaining === 0) {
        showMsg(`${t('errorRateLimit')}. ${t('errorRateLimitMessage')}`, 'danger');
        throw new Error('rate-limit-exceeded');
      }
      return fetchAllForksProgressively(repo, (pageData, allData, page) => {
        renderPage(pageData, page);
      }, nextPage);
    })
    .then(() => {
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
      if (error.message === 'rate-limit-exceeded') {
        return;
      }

      const msg =
        error.toString().indexOf('Forbidden') >= 0
          ? `${t('errorRateLimit')}. ${t('errorRateLimitMessage')}`
          : error;
      showMsg(`${msg}. ${t('messageTryAgain')}`, 'danger');
      console.error(error);
    });
}

function showMsg(msg, type) {
  let alert_type = 'alert-info';

  if (type === 'danger') {
    alert_type = 'alert-danger';
  }

  const footerText = document.getElementById('footer-text');
  if (footerText) {
    footerText.innerHTML = '';
  }

  document.getElementById('data-body').innerHTML = `
        <div class="alert ${alert_type} alert-dismissible fade show" role="alert">
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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

function showToast(message) {
  const toastEl = document.getElementById('liveToast');
  const toastMsg = document.getElementById('toast-message');
  if (toastEl && toastMsg) {
    toastMsg.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
    toast.show();
  }
}

function setLoading(isLoading) {
  const spinner = document.getElementById('spinner');
  const findBtn = document.getElementById('find');
  if (spinner) spinner.hidden = !isLoading;
  if (findBtn) findBtn.disabled = isLoading;
}

// --- Rate Limit System ---

window.currentResetTimestamp = null;
window.cachedRateLimitPromise = null;
window.cachedRateLimitData = null;
window.cachedRateLimitReset = 0;
window.latestForks = [];
// Cache TTL in seconds (default 1 hour)
window.PAGE_CACHE_TTL = 60 * 60;

function cacheKeyFor(repo, page) {
  return `af_cache::${repo}::p${page}`;
}

function setCachedPage(repo, page, data) {
  try {
    const key = cacheKeyFor(repo, page);
    const item = { ts: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    // ignore quota errors
    console.error('Failed to set cache', e);
  }
}

function getCachedPage(repo, page) {
  try {
    const key = cacheKeyFor(repo, page);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (!item || !item.ts) return null;
    const ageSec = (Date.now() - item.ts) / 1000;
    if (ageSec > (window.PAGE_CACHE_TTL || 3600)) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch (e) {
    console.error('Failed to read cache', e);
    return null;
  }
}

function loadCachedPages(repo, onPage) {
  const pages = [];
  let page = 1;
  while (true) {
    const cached = getCachedPage(repo, page);
    if (!cached || !Array.isArray(cached) || cached.length === 0) break;
    pages.push(...cached);
    if (typeof onPage === 'function') {
      onPage(cached, page);
    }
    if (cached.length < 100) break;
    page += 1;
  }
  return page;
}

function cacheRateLimitData(core) {
  if (!core || typeof core.remaining !== 'number' || typeof core.limit !== 'number') return;
  window.cachedRateLimitData = core;
  window.cachedRateLimitPromise = Promise.resolve(core);
  window.cachedRateLimitReset = core.reset || Math.floor(Date.now() / 1000) + 60;
}

function refreshRateLimitDisplay() {
  if (!window.cachedRateLimitData) return;
  const { remaining, limit, reset } = window.cachedRateLimitData;
  updateRateLimitUI(remaining, limit, reset);
}

function getRateLimitTimeText(reset) {
  const secondsLeft = Math.max(0, reset - Math.floor(Date.now() / 1000));
  const minutesLeft = Math.max(0, Math.ceil(secondsLeft / 60));
  if (minutesLeft > 0) {
    return `${minutesLeft} ${t('minutes')}`;
  }
  return `${secondsLeft} ${t('seconds')}`;
}

function getRateLimitFooterText(remaining, limit, reset) {
  const timeStr = getRateLimitTimeText(reset);
  const template = t('rateLimitFooterText');
  return template
    .replace('{remaining}', remaining)
    .replace('{limit}', limit)
    .replace('{time}', timeStr);
}

function updateRateLimitUI(remaining, limit, reset) {
  const container = document.getElementById('rate-limit-container');
  const progress = document.getElementById('rate-limit-progress');
  const text = document.getElementById('rate-limit-text');

  if (!container || !progress || !text) return;

  window.currentResetTimestamp = reset;
  cacheRateLimitData({ remaining, limit, reset });

  const pct = limit > 0 ? (remaining / limit) * 100 : 0;
  progress.style.width = `${pct}%`;
  progress.setAttribute('aria-valuenow', pct);

  // Set color class based on remaining quota percentage
  progress.className = 'progress-bar';
  if (pct > 50) {
    progress.classList.add('bg-success');
  } else if (pct > 20) {
    progress.classList.add('bg-warning');
  } else {
    progress.classList.add('bg-danger');
  }

  text.textContent = getRateLimitFooterText(remaining, limit, reset);

  // Update initial title tooltip
  if (reset) {
    const tooltipTemplate = t('rateLimitTooltip');
    container.setAttribute('title', tooltipTemplate.replace('{time}', getRateLimitTimeText(reset)));
  }

  container.style.opacity = '1';
}

function fetchRateLimitData() {
  const now = Math.floor(Date.now() / 1000);
  if (window.cachedRateLimitPromise && (window.cachedRateLimitReset === 0 || now < window.cachedRateLimitReset)) {
    return window.cachedRateLimitPromise;
  }

  const promise = fetch('https://api.github.com/rate_limit')
    .then(response => {
      if (!response.ok) throw new Error('RateLimitFetchFailed');
      return response.json();
    })
    .then(data => {
      if (data && data.resources && data.resources.core) {
        const core = data.resources.core;
        const result = {
          remaining: core.remaining,
          limit: core.limit,
          reset: core.reset,
        };
        cacheRateLimitData(result);
        return result;
      }
      throw new Error('RateLimitMalformed');
    })
    .catch(err => {
      window.cachedRateLimitPromise = null;
      throw err;
    });

  window.cachedRateLimitPromise = promise;
  return promise;
}

function getExportData() {
  return (window.latestForks || []).map(fork => ({
    full_name: fork.full_name,
    html_url: `https://github.com/${fork.full_name}`,
    owner: fork.owner ? fork.owner.login : '',
    default_branch: fork.default_branch,
    stargazers_count: fork.stargazers_count,
    forks: fork.forks,
    open_issues_count: fork.open_issues_count,
    size: fork.size,
    pushed_at: fork.pushed_at,
  }));
}

function buildCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const quote = value => `"${String(value).replace(/"/g, '""')}"`;
  const lines = [headers.map(quote).join(',')];
  rows.forEach(row => {
    lines.push(headers.map(key => quote(row[key] ?? '')).join(','));
  });
  return lines.join('\r\n');
}

function parseLinkHeader(link) {
  if (!link) return {};
  return link.split(',').reduce((acc, part) => {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      acc[match[2]] = match[1];
    }
    return acc;
  }, {});
}

function fetchAllForks(repo) {
  const baseUrl = `https://api.github.com/repos/${repo}/forks?sort=stargazers&per_page=100`;
  const results = [];

  function fetchPage(url) {
    // derive page and repo from URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      urlObj = null;
    }
    let page = 1;
    if (urlObj) {
      const p = urlObj.searchParams.get('page');
      if (p) page = parseInt(p, 10) || 1;
    }
    const cached = getCachedPage(repo, page);
    if (cached) {
      results.push(...cached);
      // if cached, we still need to know whether there is a next page; try to infer from length
      if (cached.length < 100) {
        return Promise.resolve(results);
      }
      // assume maybe more pages, attempt to fetch next page URL by incrementing page
      const nextUrl = urlObj ? new URL(url) : null;
      if (nextUrl) {
        nextUrl.searchParams.set('page', String(page + 1));
        return fetchPage(nextUrl.toString());
      }
      return Promise.resolve(results);
    }

    return fetch(url)
      .then(response => {
        const limit = response.headers.get('x-ratelimit-limit');
        const remaining = response.headers.get('x-ratelimit-remaining');
        const reset = response.headers.get('x-ratelimit-reset');
        if (limit !== null && remaining !== null) {
          updateRateLimitUI(parseInt(remaining, 10), parseInt(limit, 10), parseInt(reset, 10));
        }
        if (!response.ok) {
          throw Error(response.statusText || `HTTP ${response.status}`);
        }
        return response.json().then(data => ({ data, link: response.headers.get('link'), page }));
      })
      .then(({ data, link, page }) => {
        // cache this page
        setCachedPage(repo, page, data);
        results.push(...data);
        const parsed = parseLinkHeader(link);
        if (parsed.next) {
          return fetchPage(parsed.next);
        }
        return results;
      });
  }

  return fetchPage(baseUrl);
}

function fetchAllForksProgressively(repo, onPage, startPage = 1) {
  const baseUrl = `https://api.github.com/repos/${repo}/forks?sort=stargazers&per_page=100`;
  const results = [];

  function fetchPage(url) {
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      urlObj = null;
    }
    let page = 1;
    if (urlObj) {
      const p = urlObj.searchParams.get('page');
      if (p) page = parseInt(p, 10) || 1;
    }
    if (page < startPage) {
      const nextUrl = urlObj ? new URL(url) : null;
      if (nextUrl) {
        nextUrl.searchParams.set('page', String(page + 1));
        return fetchPage(nextUrl.toString());
      }
      return Promise.resolve(results);
    }
    const cached = getCachedPage(repo, page);
    if (cached) {
      results.push(...cached);
      if (typeof onPage === 'function') {
        onPage(cached, results.slice(), page, true);
      }
      if (cached.length < 100) {
        return Promise.resolve(results);
      }
      const nextUrl = urlObj ? new URL(url) : null;
      if (nextUrl) {
        nextUrl.searchParams.set('page', String(page + 1));
        return fetchPage(nextUrl.toString());
      }
      return Promise.resolve(results);
    }

    return fetch(url)
      .then(response => {
        const limit = response.headers.get('x-ratelimit-limit');
        const remaining = response.headers.get('x-ratelimit-remaining');
        const reset = response.headers.get('x-ratelimit-reset');
        if (limit !== null && remaining !== null) {
          updateRateLimitUI(parseInt(remaining, 10), parseInt(limit, 10), parseInt(reset, 10));
        }
        if (!response.ok) {
          throw Error(response.statusText || `HTTP ${response.status}`);
        }
        return response.json().then(data => ({ data, link: response.headers.get('link'), page }));
      })
      .then(({ data, link, page }) => {
        setCachedPage(repo, page, data);
        results.push(...data);
        if (typeof onPage === 'function') {
          onPage(data, results.slice(), page, false);
        }
        const parsed = parseLinkHeader(link);
        if (parsed.next) {
          return fetchPage(parsed.next);
        }
        return results;
      });
  }

  return fetchPage(baseUrl);
}

function saveFile(content, mimeType, fileName) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast(t('toastExportSuccess'));
}

function exportJSON() {
  const repo = getRepoFromUrl() || document.getElementById('q')?.value.replaceAll(' ', '');
  if (!repo) {
    showMsg(t('errorNoDataExport'), 'danger');
    return;
  }
  fetchAllForks(repo)
    .then(rows => {
      if (!rows.length) {
        showMsg(t('errorNoDataExport'), 'danger');
        return;
      }
      saveFile(JSON.stringify(rows, null, 2), 'application/json;charset=utf-8', `active-forks-${repo}.json`);
    })
    .catch(error => {
      showMsg(`${error}. ${t('messageTryAgain')}`, 'danger');
      console.error(error);
    });
}

function exportCSV() {
  const repo = getRepoFromUrl() || document.getElementById('q')?.value.replaceAll(' ', '');
  if (!repo) {
    showMsg(t('errorNoDataExport'), 'danger');
    return;
  }
  fetchAllForks(repo)
    .then(rows => {
      if (!rows.length) {
        showMsg(t('errorNoDataExport'), 'danger');
        return;
      }
      saveFile(buildCSV(rows), 'text/csv;charset=utf-8', `active-forks-${repo}.csv`);
    })
    .catch(error => {
      showMsg(`${error}. ${t('messageTryAgain')}`, 'danger');
      console.error(error);
    });
}

function fetchRateLimit() {
  fetchRateLimitData()
    .then(core => {
      updateRateLimitUI(core.remaining, core.limit, core.reset);
    })
    .catch(err => console.error('Failed to fetch rate limit:', err));
}