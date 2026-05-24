const translations = {
  en: {
    title: 'Active GitHub Forks',
    findRepo: 'Find repository (e.g. <span id="example-repo" class="text-primary text-decoration-underline" style="cursor: pointer;">sekademi/active-forks</span>)',
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
    fontSmall: 'Small',
    fontNormal: 'Normal',
    fontLarge: 'Large',
    fontXLarge: 'Visually Impaired',
    filters: 'Filters',
    resetSettings: 'Reset Settings',
    toastThemeUpdated: 'Theme updated successfully!',
    toastFontSizeUpdated: 'Text size updated successfully!',
    toastLangUpdated: 'Language updated successfully!',
    toastPageLengthUpdated: 'Page length updated successfully!',
    toastSettingsReset: 'All settings have been reset to defaults!',
    rateLimit: 'API Rate Limit:',
    rateLimitTooltip: 'Resets in {time}',
    minutes: 'minutes',
    seconds: 'seconds',
  },
  tr: {
    title: 'Aktif GitHub Fork\'ları',
    findRepo: 'Depo bul (ör. <span id="example-repo" class="text-primary text-decoration-underline" style="cursor: pointer;">sekademi/active-forks</span>)',
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
    fontSmall: 'Küçük',
    fontNormal: 'Normal',
    fontLarge: 'Büyük',
    fontXLarge: 'Çok Büyük',
    filters: 'Filtreler',
    resetSettings: 'Ayarları Sıfırla',
    toastThemeUpdated: 'Tema başarıyla güncellendi!',
    toastFontSizeUpdated: 'Yazı boyutu başarıyla güncellendi!',
    toastLangUpdated: 'Dil başarıyla güncellendi!',
    toastPageLengthUpdated: 'Sayfa uzunluğu başarıyla güncellendi!',
    toastSettingsReset: 'Tüm ayarlar varsayılana sıfırlandı!',
    rateLimit: 'API İstek Limiti:',
    rateLimitTooltip: '{time} içinde sıfırlanacak',
    minutes: 'dakika',
    seconds: 'saniye',
  },
  de: {
    title: 'Aktive GitHub-Forks',
    findRepo: 'Repository finden (z. B. <span id="example-repo" class="text-primary text-decoration-underline" style="cursor: pointer;">sekademi/active-forks</span>)',
    find: 'Suchen',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    themeAuto: 'Auto',
    sourceCode: 'Quellcode auf GitHub',
    errorInvalid: 'Ungültiges GitHub-Repository! Format ist &lt;Benutzername&gt;/&lt;Repository&gt;',
    errorRateLimit: 'Fehler: API-Ratenlimit überschritten',
    colLink: 'Link',
    colOwner: 'Besitzer',
    colName: 'Name',
    colBranch: 'Branch',
    colStars: 'Sterne',
    colForks: 'Forks',
    colIssues: 'Offene Issues',
    colSize: 'Größe',
    colLastPush: 'Letzter Push',
    fontSmall: 'Klein',
    fontNormal: 'Normal',
    fontLarge: 'Groß',
    fontXLarge: 'Sehr groß',
    filters: 'Filter',
    resetSettings: 'Einstellungen zurücksetzen',
    toastThemeUpdated: 'Theme erfolgreich aktualisiert!',
    toastFontSizeUpdated: 'Textgröße erfolgreich aktualisiert!',
    toastLangUpdated: 'Sprache erfolgreich aktualisiert!',
    toastPageLengthUpdated: 'Zeilenanzahl erfolgreich aktualisiert!',
    toastSettingsReset: 'Alle Einstellungen wurden zurückgesetzt!',
    rateLimit: 'API-Ratenlimit:',
    rateLimitTooltip: 'Wird in {time} zurückgesetzt',
    minutes: 'Minuten',
    seconds: 'Sekunden',
  },
  zh: {
    title: '活跃的 GitHub Forks',
    findRepo: '查找仓库（例如 <span id="example-repo" class="text-primary text-decoration-underline" style="cursor: pointer;">sekademi/active-forks</span>）',
    find: '查找',
    themeLight: '浅色',
    themeDark: '深色',
    themeAuto: '自动',
    sourceCode: 'GitHub 上的源代码',
    errorInvalid: '无效的 GitHub 仓库！格式为 &lt;用户名&gt;/&lt;仓库名&gt;',
    errorRateLimit: '错误：超出 API 速率限制',
    colLink: '链接',
    colOwner: '所有者',
    colName: '名称',
    colBranch: '分支',
    colStars: '星标',
    colForks: 'Fork 数',
    colIssues: '未解决的 Issue',
    colSize: '大小',
    colLastPush: '最后推送',
    fontSmall: '小',
    fontNormal: '正常',
    fontLarge: '大',
    fontXLarge: '超大',
    filters: '过滤器',
    resetSettings: '重置设置',
    toastThemeUpdated: '主题更新成功！',
    toastFontSizeUpdated: '字体大小更新成功！',
    toastLangUpdated: '语言更新成功！',
    toastPageLengthUpdated: '每页条数更新成功！',
    toastSettingsReset: '所有设置已重置为默认值！',
    rateLimit: 'API 速率限制：',
    rateLimitTooltip: '{time} 后重置',
    minutes: '分钟',
    seconds: '秒',
  },
};

function getLanguage() {
  try {
    const stored = localStorage.getItem('lang');
    if (stored && translations[stored]) return stored;
  } catch (e) {
    console.error('localStorage access denied:', e);
  }
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('tr')) return 'tr';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('zh')) return 'zh';
  return 'en';
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
      el.innerHTML = text;
    }
  });
  // Update page title
  document.title = t('title');
  // Update html lang attribute
  document.documentElement.lang = getLanguage();
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  try {
    localStorage.setItem('lang', lang);
  } catch (e) {
    console.error('localStorage access denied:', e);
  }
  applyTranslations();
}
