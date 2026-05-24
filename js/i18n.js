const translations = {
  en: {
    title: 'Active GitHub Forks',
    findRepo: 'Find repository (e.g. "techgaun/github-dorks")',
    find: 'Find',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeAuto: 'Auto',
    sourceCode: 'Source code on GitHub',
    errorInvalid: 'Invalid GitHub repository! Format is &lt;username&gt;/&lt;repo&gt;',
    errorRateLimit: 'Error: API Rate Limit Exceeded',
    colLink: 'Link',
    colOwner: 'Owner',
    colName: 'Name',
    colBranch: 'Branch',
    colStars: 'Stars',
    colForks: 'Forks',
    colIssues: 'Open Issues',
    colSize: 'Size',
    colLastPush: 'Last Push',
  },
  tr: {
    title: 'Aktif GitHub Fork\'ları',
    findRepo: 'Depo bul (ör. "techgaun/github-dorks")',
    find: 'Bul',
    themeLight: 'Açık',
    themeDark: 'Koyu',
    themeAuto: 'Otomatik',
    sourceCode: 'GitHub\'daki kaynak kod',
    errorInvalid: 'Geçersiz GitHub deposu! Format: &lt;kullanıcı&gt;/&lt;depo&gt;',
    errorRateLimit: 'Hata: API İstek Limiti Aşıldı',
    colLink: 'Bağlantı',
    colOwner: 'Sahibi',
    colName: 'Ad',
    colBranch: 'Dal',
    colStars: 'Yıldız',
    colForks: 'Fork',
    colIssues: 'Açık Sorunlar',
    colSize: 'Boyut',
    colLastPush: 'Son Push',
  },
};

function getLanguage() {
  const stored = localStorage.getItem('lang');
  if (stored && translations[stored]) return stored;
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('tr') ? 'tr' : 'en';
}

function t(key) {
  const lang = getLanguage();
  return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (el.hasAttribute('data-i18n-attr')) {
      el.setAttribute(el.getAttribute('data-i18n-attr'), text);
    } else {
      el.textContent = text;
    }
  });
  // Update page title
  document.title = t('title');
  // Update html lang attribute
  document.documentElement.lang = getLanguage() === 'tr' ? 'tr' : 'en';
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  localStorage.setItem('lang', lang);
  applyTranslations();
}
