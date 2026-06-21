'use strict';

// ISO 639-1 codes. YouTube API returns BCP-47; CLD returns its own subset.
const LANGUAGES = [
  { code: '',      label: 'All Languages' },
  { code: 'ar',    label: 'Arabic' },
  { code: 'bn',    label: 'Bengali' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'cs',    label: 'Czech' },
  { code: 'da',    label: 'Danish' },
  { code: 'nl',    label: 'Dutch' },
  { code: 'en',    label: 'English' },
  { code: 'fi',    label: 'Finnish' },
  { code: 'fr',    label: 'French' },
  { code: 'de',    label: 'German' },
  { code: 'el',    label: 'Greek' },
  { code: 'gu',    label: 'Gujarati' },
  { code: 'he',    label: 'Hebrew' },
  { code: 'hi',    label: 'Hindi' },
  { code: 'hu',    label: 'Hungarian' },
  { code: 'id',    label: 'Indonesian' },
  { code: 'it',    label: 'Italian' },
  { code: 'ja',    label: 'Japanese' },
  { code: 'kn',    label: 'Kannada' },
  { code: 'ko',    label: 'Korean' },
  { code: 'ms',    label: 'Malay' },
  { code: 'ml',    label: 'Malayalam' },
  { code: 'mr',    label: 'Marathi' },
  { code: 'no',    label: 'Norwegian' },
  { code: 'fa',    label: 'Persian' },
  { code: 'pl',    label: 'Polish' },
  { code: 'pt',    label: 'Portuguese' },
  { code: 'pa',    label: 'Punjabi' },
  { code: 'ro',    label: 'Romanian' },
  { code: 'ru',    label: 'Russian' },
  { code: 'sk',    label: 'Slovak' },
  { code: 'es',    label: 'Spanish' },
  { code: 'sv',    label: 'Swedish' },
  { code: 'ta',    label: 'Tamil' },
  { code: 'te',    label: 'Telugu' },
  { code: 'th',    label: 'Thai' },
  { code: 'tr',    label: 'Turkish' },
  { code: 'uk',    label: 'Ukrainian' },
  { code: 'ur',    label: 'Urdu' },
  { code: 'vi',    label: 'Vietnamese' },
];

// ISO 3166-1 alpha-2 codes — matched against YouTube Data API channels.list
// snippet.country. Sorted by name for the picker. `code` is what we store/compare.
const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' }, { code: 'AO', name: 'Angola' }, { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' }, { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' }, { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' }, { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' }, { code: 'KH', name: 'Cambodia' }, { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' }, { code: 'CV', name: 'Cape Verde' }, { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo (DRC)' }, { code: 'CR', name: 'Costa Rica' }, { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' }, { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' }, { code: 'DK', name: 'Denmark' }, { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'Dominican Republic' }, { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' }, { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' }, { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' }, { code: 'FJ', name: 'Fiji' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' }, { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' }, { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' }, { code: 'GD', name: 'Grenada' }, { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' }, { code: 'HN', name: 'Honduras' }, { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' }, { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' }, { code: 'KI', name: 'Kiribati' },
  { code: 'KR', name: 'South Korea' }, { code: 'KP', name: 'North Korea' }, { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Laos' }, { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' }, { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' }, { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' }, { code: 'MO', name: 'Macau' }, { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' }, { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' }, { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' }, { code: 'MU', name: 'Mauritius' }, { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' }, { code: 'MD', name: 'Moldova' }, { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' }, { code: 'ME', name: 'Montenegro' }, { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' }, { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' }, { code: 'MK', name: 'North Macedonia' }, { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' }, { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine' }, { code: 'PA', name: 'Panama' }, { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' }, { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' }, { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' }, { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' }, { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'São Tomé and Príncipe' }, { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' }, { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' }, { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' }, { code: 'SR', name: 'Suriname' }, { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syria' }, { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania' }, { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' }, { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' }, { code: 'TV', name: 'Tuvalu' }, { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' }, { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' }, { code: 'VA', name: 'Vatican City' }, { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' }, { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];
const COUNTRY_NAME = Object.fromEntries(COUNTRIES.map(c => [c.code, c.name]));

// Quiet diagnostic logging — console only, filter by "YTLF" in DevTools.
// No on-page UI: the extension must leave no visible trace of itself.
function ytlfLog(msg) {
  console.log(`[YTLF] ${msg}`);
}

const LANG_KEY          = 'ytlf_lang';
const COUNTRIES_KEY     = 'ytlf_countries';      // JSON array of selected alpha-2 codes
const SHOW_UNKNOWN_KEY  = 'ytlf_show_unknown';   // '1' = keep channels with no country
const API_KEY           = 'ytlf_api_key';
const HIDE_HOME_KEY      = 'ytlf_hide_home';
const HIDE_SIDEBAR_KEY   = 'ytlf_hide_sidebar';
const HIDE_PLAYLIST_KEY  = 'ytlf_hide_playlist'; // also hide the playlist (default); off = keep it
const HIDE_SHORTS_KEY    = 'ytlf_hide_shorts';
const HIDE_ENGAGEMENTS_KEY = 'ytlf_hide_engagements';
const HIDE_COMMENTS_KEY  = 'ytlf_hide_comments';
const ENABLED_KEY        = 'ytlf_enabled';
const MIN_TEXT_LEN = 12;   // CLD needs enough chars to be confident
const MIN_CONF     = 55;   // below this % we show the video rather than wrongly hide it
const BATCH_MS     = 50;   // debounce window to collect IDs before one API call
const THEME_KEY    = 'ytlf_theme'; // 'light' | 'dark' | absent = follow YouTube

// All YouTube renderer types we filter:
// ytd-video-renderer       → search results
// ytd-compact-video-renderer → watch page sidebar / Up Next
// ytd-rich-item-renderer   → homepage grid & subscription feed
const RENDERER_SEL = 'ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer';

// --- API key + display toggles: cached in memory, kept fresh via storage.onChanged ---

let cachedApiKey  = null;
let hideHome      = false;
let hideSidebar   = false;
let hidePlaylist  = true;  // when hideSidebar: also hide the playlist (default). off = keep it
let hideShorts    = false;
let hideEngagements = false;
let hideComments  = false;
let enabled       = true;   // master on/off switch
// Real toggle values arrive async from chrome.storage. Until they do, applyDisplayToggles
// must NOT overwrite the pre-paint <html> classes early.js set from the localStorage
// mirror — otherwise the premature init() pass (default values) would lift the guide veil
// (and hide-home) for a frame on load.
let settingsLoaded = false;

chrome.storage.sync.get(
  [API_KEY, HIDE_HOME_KEY, HIDE_SIDEBAR_KEY, HIDE_PLAYLIST_KEY, HIDE_SHORTS_KEY,
   HIDE_ENGAGEMENTS_KEY, HIDE_COMMENTS_KEY, ENABLED_KEY],
  (res) => {
    cachedApiKey    = res[API_KEY] || null;
    hideHome        = !!res[HIDE_HOME_KEY];
    hideSidebar     = !!res[HIDE_SIDEBAR_KEY];
    hidePlaylist    = res[HIDE_PLAYLIST_KEY] !== false; // default ON (full hide)
    hideShorts      = !!res[HIDE_SHORTS_KEY];
    hideEngagements = !!res[HIDE_ENGAGEMENTS_KEY];
    hideComments    = !!res[HIDE_COMMENTS_KEY];
    enabled       = res[ENABLED_KEY] !== false; // default on
    settingsLoaded = true;
    mirrorEarlyPrefs();
    applyDisplayToggles();
  }
);

// Mirror the flash-prone prefs to localStorage (SYNCHRONOUS) so early.js can read them
// at document_start and hide the homepage feed + left-menu distraction sections BEFORE
// YouTube paints. The authoritative values live in chrome.storage.sync (async — too late
// to avoid a flash on a fresh tab).
function mirrorEarlyPrefs() {
  try {
    localStorage.setItem(ENABLED_KEY, enabled ? '1' : '0');
    localStorage.setItem(HIDE_HOME_KEY, hideHome ? '1' : '0');
    localStorage.setItem(HIDE_ENGAGEMENTS_KEY, hideEngagements ? '1' : '0');
  } catch { /* localStorage blocked */ }
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes[API_KEY]) {
    cachedApiKey = changes[API_KEY].newValue || null;
    if (enabled) filterAll();
  }
  if (changes[HIDE_HOME_KEY]) {
    hideHome = !!changes[HIDE_HOME_KEY].newValue;
    mirrorEarlyPrefs();
    applyDisplayToggles();
  }
  if (changes[HIDE_SIDEBAR_KEY]) {
    hideSidebar = !!changes[HIDE_SIDEBAR_KEY].newValue;
    applyDisplayToggles();
  }
  if (changes[HIDE_PLAYLIST_KEY]) {
    hidePlaylist = changes[HIDE_PLAYLIST_KEY].newValue !== false;
    applyDisplayToggles();
  }
  if (changes[HIDE_SHORTS_KEY]) {
    hideShorts = !!changes[HIDE_SHORTS_KEY].newValue;
    applyDisplayToggles();
  }
  if (changes[HIDE_ENGAGEMENTS_KEY]) {
    hideEngagements = !!changes[HIDE_ENGAGEMENTS_KEY].newValue;
    mirrorEarlyPrefs();
    applyDisplayToggles();
  }
  if (changes[HIDE_COMMENTS_KEY]) {
    hideComments = !!changes[HIDE_COMMENTS_KEY].newValue;
    applyDisplayToggles();
  }
  if (changes[ENABLED_KEY]) {
    enabled = changes[ENABLED_KEY].newValue !== false;
    mirrorEarlyPrefs();
    if (!enabled) {
      // Turned OFF → leave NO trace on YouTube: remove the widget, drop the veil,
      // clear every body class + inline style we ever set, restore audio/captions.
      document.getElementById('ytlf')?.remove();
      revealAll();
      applyDisplayToggles(); // !enabled branch removes all ytlf-* body classes
    } else {
      injectWidget();
      applyDisplayToggles();
      if (isFilteredPage()) filterAll();
    }
  }
});

// Tag Shorts elements with data-ytlf-shorts so CSS can hide them.
// Uses title-text matching as the primary strategy — works regardless of what
// element name YouTube uses. Also covers known element types and /shorts/ links.
// Set a data-attribute only when it would actually change. Writing dataset
// unconditionally fires a MutationObserver record even when the value is
// unchanged, which would feed our own observer in a loop. mark() makes the
// tagging idempotent and feedback-free.
function mark(el, prop) {
  if (el && el.dataset[prop] !== '1') el.dataset[prop] = '1';
}

// The element it is SAFE to hide for a given shorts element. The hard rule: never
// hide a search-results section that also holds real videos. On /results the whole
// results list — reel shelf included — lives in ONE ytd-item-section-renderer, so
// hiding that section empties the list and throws YouTube's infinite scroll into a
// continuous refresh loop. Homepage shorts sit in a dedicated rich wrapper (safe to
// hide whole); a search reel shelf in a mixed section → hide just the shelf; a
// section that is purely shorts → hide the section.
function shortsHideTarget(el) {
  const rich = el.closest('ytd-rich-section-renderer, ytd-rich-item-renderer');
  if (rich) return rich;
  const section = el.closest('ytd-item-section-renderer');
  if (section && !section.querySelector('ytd-video-renderer')) return section;
  return el;
}

// Horizontal "shelf" wrappers YouTube groups content in. A Shorts shelf can be ANY
// of these with a TOPIC title (e.g. "Baking") and the Shorts icon — not the word
// "Shorts", and not always ytd-reel-shelf-renderer (newer ones are view-models) —
// so we detect a shelf by the shorts content inside it. Deliberately EXCLUDES
// ytd-item-section-renderer: the main vertical results live there and must never
// be taken down as a unit.
const SHORTS_SHELF_SEL =
  'ytd-reel-shelf-renderer, ytd-rich-shelf-renderer, ytd-shelf-renderer, ' +
  'grid-shelf-view-model, ytd-horizontal-card-list-renderer, yt-horizontal-list-renderer';

// `node` is known to BE shorts (a /shorts/ link, a shorts lockup, a SHORTS overlay).
// Hide the whole enclosing shorts shelf when there is one; else the single card;
// else the nearest safe container. shortsHideTarget guarantees we never hide a
// section that still holds real vertical results.
function hideShortsContent(node) {
  const shelf = node.closest(SHORTS_SHELF_SEL);
  if (shelf) { mark(shortsHideTarget(shelf), 'ytlfShorts'); return; }
  const card = node.closest(
    'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ' +
    'ytd-video-renderer, ytd-reel-item-renderer, ' +
    'yt-shorts-lockup-view-model, ytm-shorts-lockup-view-model'
  );
  mark(card ?? shortsHideTarget(node), 'ytlfShorts');
}

let shortsTagTimer = null;
function tagShorts() {
  // A section tagged while it was shorts-only but that has since gained real video
  // results must be un-tagged, or the stale tag keeps the new results hidden.
  document.querySelectorAll('ytd-item-section-renderer[data-ytlf-shorts]').forEach(sec => {
    if (sec.querySelector('ytd-video-renderer')) delete sec.dataset.ytlfShorts;
  });
  // Known shorts element types/attributes — hide each via its safe target.
  for (const sel of [
    'ytd-reel-shelf-renderer', 'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-shelf-renderer[is-shorts]', 'ytd-reel-item-renderer',
    'ytd-shorts', 'yt-shorts-lockup-view-model', 'ytm-shorts-lockup-view-model',
  ]) {
    document.querySelectorAll(sel).forEach(el => mark(shortsHideTarget(el), 'ytlfShorts'));
  }
  // Shorts CONTENT anywhere — the robust catch. /shorts/ links cover topic-titled
  // view-model shelves (e.g. "🩳 Baking") and individual short cards; the SHORTS
  // thumbnail overlay and [is-shorts] catch shorts whose element type we don't know.
  document.querySelectorAll(
    'a[href^="/shorts/"], [overlay-style="SHORTS"], [is-shorts]'
  ).forEach(hideShortsContent);
  // Dedicated shelves YouTube labels "Shorts" by header text (unknown element types).
  document.querySelectorAll(SHORTS_SHELF_SEL).forEach(shelf => {
    const text = shelf.querySelector('#title, h2, #header-text, .title, #title-text')?.textContent ?? '';
    if (/shorts/i.test(text)) mark(shortsHideTarget(shelf), 'ytlfShorts');
  });
}

// Tag Playables elements similarly
function tagPlayables() {
  for (const sel of ['ytd-game-card-renderer']) {
    document.querySelectorAll(sel).forEach(el => {
      mark(el.closest('ytd-rich-section-renderer, ytd-rich-item-renderer') ?? el, 'ytlfPlayables');
    });
  }
  document.querySelectorAll('ytd-rich-section-renderer').forEach(sec => {
    const text = sec.querySelector('#title, h2, yt-formatted-string')?.textContent ?? '';
    if (/playable/i.test(text)) mark(sec, 'ytlfPlayables');
  });
}

// Selectors for elements that count as "engagements" (view counts, likes, etc.)
const ENGAGEMENT_SELS = [
  '#metadata-line',
  'span.inline-metadata-item',
  'ytd-video-view-count-renderer',
  'yt-view-count-renderer',
  'ytd-watch-info-text',
  'segmented-like-dislike-button-view-model',
  'ytd-segmented-like-dislike-button-renderer',
  '#owner-sub-count',
  '#subscriber-count',
  '#subscribers',
  'ytd-video-description-header-renderer #subscriber-count',
  'ytd-video-description-header-renderer #subscribers',
  'yt-content-metadata-view-model',
  '#channel-stats',
  'ytd-channel-about-stats-renderer',
  'ytd-channel-renderer #subscribers',
  'ytd-channel-renderer #video-count',
  'ytd-notification-topbar-button-renderer',
  '#notification-button',
  'ytd-feed-filter-chip-bar-renderer',
];

// Directly set inline styles on engagement elements. This works regardless of
// YouTube's CSP (no <style> injection) and regardless of shadow DOM (we use
// querySelectorAll which reaches Polymer light-DOM templates).
// Hide Engagements also blanks distracting LEFT-SIDEBAR (guide) sections: the
// "Explore" and "More from YouTube" sections, the "Subscriptions" channel list, and
// the "Movies & TV" entry inside the "You" section. Matched by their heading/entry
// text (CSS can't match text), then hidden via [data-ytlf-eng-hide] in styles.css.
// Text match is English (the user's YouTube UI language).
const ENG_HIDE_SECTIONS = ['explore', 'more from youtube', 'subscriptions'];
function tagEngagementSidebar() {
  const on = hideEngagements && enabled;
  if (!on) {
    document.querySelectorAll('[data-ytlf-eng-hide]').forEach(el => delete el.dataset.ytlfEngHide);
    return;
  }
  // Whole guide sections. The title element varies across YouTube versions, and the
  // Subscriptions section's header is a LINK to /feed/subscriptions (often with a
  // trailing "›" chevron), so match by: (a) heading text starts-with a target phrase
  // — tolerant of the chevron — across several title-element variants, OR (b) a header
  // link to the subscriptions feed. The header link, NOT entry links, so we never hit
  // the "Subscriptions" item in the main nav (its link lives in #items, not #header).
  document.querySelectorAll('ytd-guide-section-renderer').forEach(sec => {
    const titleText = (sec.querySelector(
      '#guide-section-title, a#guide-section-title, [id="guide-section-title"], ' +
      '#header #title, #header h3, h3.ytd-guide-section-renderer'
    )?.textContent || '').trim().toLowerCase();
    const byTitle = ENG_HIDE_SECTIONS.some(t => titleText === t || titleText.startsWith(t));
    const subsHeaderLink = !!sec.querySelector(
      'a#guide-section-title[href*="/feed/subscriptions"], #header a[href*="/feed/subscriptions"]'
    );
    if (byTitle || subsHeaderLink) { if (sec.dataset.ytlfEngHide !== '1') sec.dataset.ytlfEngHide = '1'; }
    else if (sec.dataset.ytlfEngHide) delete sec.dataset.ytlfEngHide;
  });
  // Single guide entries to hide: "Movies & TV" (keep the rest of its "You" section)
  // and "Report history" (the flagged item above the footer).
  document.querySelectorAll('ytd-guide-entry-renderer').forEach(entry => {
    // Label lives in .title on most builds; fall back to the link's title attribute
    // (the hook ad-block filters rely on) so a markup change can't strand these.
    const t = (entry.querySelector('.title')?.textContent
      ?? entry.querySelector('a[title]')?.getAttribute('title') ?? '').trim().toLowerCase();
    const hit = /^movies\s*&\s*tv$/.test(t) || t === 'report history';
    if (hit) { if (entry.dataset.ytlfEngHide !== '1') entry.dataset.ytlfEngHide = '1'; }
    else if (entry.dataset.ytlfEngHide) delete entry.dataset.ytlfEngHide;
  });
}

let engagementsTimer = null;
function applyEngagementsDom() {
  const on = hideEngagements && enabled;
  tagEngagementSidebar();
  for (const sel of ENGAGEMENT_SELS) {
    document.querySelectorAll(sel).forEach(el => {
      if (on) el.style.setProperty('display', 'none', 'important');
      else    el.style.removeProperty('display');
    });
  }

  // Subscriber counts show up in many element types/ids across YouTube versions —
  // the owner renderer, the description header, the structured-description channel
  // card (the one with the channel's video list + social links), assorted
  // view-models — too many to enumerate as selectors, and the description-card one
  // has no #owner-sub-count/#subscribers id so the rules above miss it. Robust
  // catch-all: inside the watch-page owner/description/channel areas, hide any leaf
  // element whose OWN text is exactly a subscriber count ("1.38M subscribers"). Tag
  // what we hide so the toggle can reveal it again.
  const SUB_RE = /^\d[\d.,]*\s*[KMB]?\s+subscribers?$/i;
  if (on) {
    document.querySelectorAll(
      'ytd-video-owner-renderer, ytd-video-description-header-renderer, ' +
      'ytd-structured-description-content-renderer, ytd-watch-metadata, ' +
      'ytd-engagement-panel-section-list-renderer, ytd-channel-renderer'
    ).forEach(scope => {
      scope.querySelectorAll('*').forEach(node => {
        if (node.childElementCount <= 1 && SUB_RE.test(node.textContent?.trim() ?? '')) {
          node.style.setProperty('display', 'none', 'important');
          node.dataset.ytlfSubhidden = '1';
        }
      });
    });
    // The watch-page "Ask" (AI) button has no stable selector — match it by its
    // aria-label/text in the actions row and hide its button wrapper.
    document.querySelectorAll(
      'ytd-watch-metadata button, ytd-watch-metadata a, ytd-watch-metadata [role="button"]'
    ).forEach(btn => {
      const label = (btn.getAttribute('aria-label') || btn.textContent || '').trim().toLowerCase();
      if (label === 'ask') {
        const target = btn.closest('yt-button-view-model, ytd-button-renderer, ytd-toggle-button-renderer') || btn;
        target.style.setProperty('display', 'none', 'important');
        target.dataset.ytlfSubhidden = '1';
      }
    });
  } else {
    document.querySelectorAll('[data-ytlf-subhidden]').forEach(node => {
      node.style.removeProperty('display');
      delete node.dataset.ytlfSubhidden;
    });
  }

  // Watch page: hide everything rendered after ytd-watch-metadata (comments etc.)
  document.querySelectorAll('ytd-watch-metadata').forEach(meta => {
    let sib = meta.nextElementSibling;
    while (sib) {
      if (on) sib.style.setProperty('display', 'none', 'important');
      else    sib.style.removeProperty('display');
      sib = sib.nextElementSibling;
    }
  });

  // Lift the guide veil (styles.css hides the whole guide until this class is set) once
  // the guide exists and its distraction sections have just been tagged above — so the
  // menu is revealed already-filtered and the sections never flash on load.
  if (on && document.querySelector('ytd-guide-section-renderer')) {
    document.documentElement.classList.add('ytlf-eng-ready');
  }
}

function applyDisplayToggles() {
  if (!enabled) {
    // ytlf-hide-home / ytlf-hide-engagements also live on <html> (early.js sets them at
    // document_start) — clear them there too.
    document.documentElement.classList.remove('ytlf-hide-home', 'ytlf-hide-engagements');
    document.body?.classList.remove(
      'ytlf-hide-home', 'ytlf-hide-sidebar', 'ytlf-sidebar-playlist', 'ytlf-hide-shorts',
      'ytlf-hide-playables', 'ytlf-hide-engagements', 'ytlf-hide-comments'
    );
    applyEngagementsDom();
    return;
  }
  // Keep the <html> classes in lockstep with the real settings so early.js's pre-paint
  // hide is corrected if a toggle changed since the last load. Skip until settings have
  // loaded, so the premature init() pass (default values) can't lift early.js's veil.
  if (settingsLoaded) {
    document.documentElement.classList.toggle('ytlf-hide-home',        hideHome);
    document.documentElement.classList.toggle('ytlf-hide-engagements', hideEngagements);
  }
  document.body?.classList.toggle('ytlf-hide-home',        hideHome);
  document.body?.classList.toggle('ytlf-hide-sidebar',     hideSidebar);
  // ytlf-sidebar-playlist = "keep playlist" mode = sidebar hidden but Hide playlist OFF.
  document.body?.classList.toggle('ytlf-sidebar-playlist', hideSidebar && !hidePlaylist);
  document.body?.classList.toggle('ytlf-hide-shorts',      hideShorts);
  document.body?.classList.add('ytlf-hide-playables');
  document.body?.classList.toggle('ytlf-hide-engagements', hideEngagements);
  document.body?.classList.toggle('ytlf-hide-comments',    hideComments);
  applyEngagementsDom();
  if (hideShorts) tagShorts();
  tagPlayables();
}

// --- Language helpers ---

function getLang() { return localStorage.getItem(LANG_KEY) ?? ''; }
function setLang(code) {
  localStorage.setItem(LANG_KEY, code);
  // A stored translation is only valid for the language it was made for. Keep the
  // original query (ORIG_QUERY_KEY) so switching language re-translates from the
  // user's original text, never from a prior translation.
  sessionStorage.removeItem(LAST_TRANSLATED_KEY);
  // Re-arm the veil so the next results load blanks again until it has settled.
  veilReset();
}

// --- Country filter (search results only) ---
// Selected channel-countries (ISO alpha-2). The country of a video's channel must
// be one of these for the video to show. Requires the YouTube Data API key.
function getCountries() {
  try { const a = JSON.parse(localStorage.getItem(COUNTRIES_KEY) || '[]'); return Array.isArray(a) ? a : []; }
  catch { return []; }
}
function setCountries(codes) {
  localStorage.setItem(COUNTRIES_KEY, JSON.stringify(codes));
  veilReset(); // re-arm the veil; the next decision pass blanks until it settles
}
// Whether to KEEP videos whose channel has no country set (toggle in the picker).
function getShowUnknown() { return localStorage.getItem(SHOW_UNKNOWN_KEY) === '1'; }
function setShowUnknown(on) {
  localStorage.setItem(SHOW_UNKNOWN_KEY, on ? '1' : '0');
  veilReset();
}

// Country filtering is scoped to the search-results page only.
function countryActive() {
  return window.location.pathname === '/results' && getCountries().length > 0;
}
// Any filter that should gate rendering / drive the veil on the current page.
function anyFilterActive() { return !!getLang() || countryActive(); }

// Decisions depend on BOTH the language and (on /results) the country selection +
// the show-unknown toggle, so the decision cache is keyed by all of them.
function filterKey() {
  const lang = getLang();
  if (window.location.pathname === '/results') {
    return `${lang}|${getCountries().slice().sort().join(',')}|${getShowUnknown() ? 1 : 0}`;
  }
  return `${lang}|`;
}

// --- Theme ---

function ytIsDark() { return document.documentElement.hasAttribute('dark'); }

function resolveTheme() {
  return localStorage.getItem(THEME_KEY) ?? (ytIsDark() ? 'dark' : 'light');
}

function applyTheme(widget, theme) {
  widget.dataset.theme = theme;
  const btn = widget.querySelector('#ytlf-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '🌙';
}

// Follow YouTube's own theme switch when the user hasn't picked one manually
new MutationObserver(() => {
  if (localStorage.getItem(THEME_KEY)) return;
  const w = document.getElementById('ytlf');
  if (w) applyTheme(w, ytIsDark() ? 'dark' : 'light');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['dark'] });

// YouTube API returns BCP-47 (e.g. "zh-Hans", "en-US"). Normalise to our codes.
function normaliseApiLang(lang) {
  if (!lang) return null;
  if (lang.startsWith('zh-Hans')) return 'zh-CN';
  if (lang.startsWith('zh-Hant')) return 'zh-TW';
  return lang.split('-')[0];
}

function isApiMatch(apiLang, selected) {
  const n = normaliseApiLang(apiLang);
  return n === selected || (n === 'zh' && (selected === 'zh-CN' || selected === 'zh-TW'));
}

// CLD returns 'zh' for both Simplified and Traditional.
function isCldMatch(detected, selected) {
  return detected === selected ||
    (detected === 'zh' && (selected === 'zh-CN' || selected === 'zh-TW'));
}

// Returns false when the extension has been reloaded and this content script
// is now an orphan — chrome APIs are gone but the script is still running.
function isContextValid() {
  try { return !!chrome.runtime?.id; }
  catch { return false; }
}

// Pages where we actively filter renderers.
// Personal pages (/feed/subscriptions, /feed/you, /feed/history, /feed/library, …)
// are excluded — filtering videos from the channels YOU chose to subscribe to (or
// your own playlists/history) by language makes no sense; you want to see them all.
function isFilteredPage() {
  const p = window.location.pathname;
  return p === '/results' ||
         p === '/watch'   ||
         p === '/'        ||
         p === '/feed/trending';
}

// --- Badge language: read YouTube's own language indicator from the video card ---
// YouTube renders a language badge (e.g. "English", "Dutch") directly in the DOM
// for videos that have language metadata set. This is more accurate than CLD because
// it reflects the actual audio language, not just the title text.

// Build a lookup: lowercase label → code  (e.g. "dutch" → "nl")
const LABEL_TO_CODE = Object.fromEntries(
  LANGUAGES.filter(l => l.code).map(l => [l.label.toLowerCase(), l.code])
);

function getBadgeLangCode(renderer) {
  // Try the selectors YouTube has used across versions, newest first.
  // We use our LANGUAGES list as an allowlist so we never mistake "4K" / "CC" for a language.
  const els = renderer.querySelectorAll(
    '.badge-shape-wiz__text, ' +               // YouTube ≥ 2024
    'ytd-badge-supported-renderer span, ' +    // mid-era
    'ytd-badge-supported-renderer p'           // older
  );
  for (const el of els) {
    const code = LABEL_TO_CODE[el.textContent.trim().toLowerCase()];
    if (code) return code;
  }
  return null; // no language badge found on this card
}

// --- Text detection (used when no API key, or when creator hasn't set a language) ---

function filterByText(renderer, id = null) {
  if (!isContextValid()) { showRenderer(renderer); return; }

  const lang = getLang(); // capture for async callback

  // 1. Try YouTube's own badge — handles "Dutch title, English video" correctly.
  const badgeCode = getBadgeLangCode(renderer);
  if (badgeCode !== null) {
    decide(renderer, (badgeCode === lang) ? '' : 'none', id);
    return;
  }

  // 2. No badge present — fall back to CLD on title + snippet text.
  const title   = renderer.querySelector('#video-title')?.textContent?.trim() ?? '';
  const snippet = renderer.querySelector('#description-text')?.textContent?.trim() ?? '';
  const text    = title.length >= MIN_TEXT_LEN ? title : `${title} ${snippet}`.trim();
  // No text to detect (music videos, symbol-only titles) — show, never strand hidden.
  if (!text) { decide(renderer, '', id); return; }

  try {
    chrome.i18n.detectLanguage(text, ({ languages }) => {
      if (!enabled) { decide(renderer, '', id); return; }
      const top = languages?.[0];
      // Renderer was pre-hidden by queueRenderer. Uncertain = show (benefit of doubt).
      const display = (!top || top.percentage < MIN_CONF || isCldMatch(top.language, lang))
        ? '' : 'none';
      decide(renderer, display, id);
    });
  } catch {
    showRenderer(renderer); // context gone mid-call — reveal rather than hide
  }
}

// --- YouTube API: videos.list, 1 unit per call, batched up to 50 IDs ---

async function fetchMetadata(ids) {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part',   'snippet');
  url.searchParams.set('id',     ids.join(','));
  // channelId is needed for the country filter (→ channels.list → snippet.country).
  url.searchParams.set('fields', 'items(id,snippet(defaultAudioLanguage,channelId))');
  url.searchParams.set('key',    cachedApiKey);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YouTube API ${res.status}`);
  return res.json();
}

// --- Channel country: channels.list → snippet.country (ISO alpha-2) ---
// Cached for the session (a channel's country effectively never changes). Value is
// the code, or null when the channel exists but set no country, so we don't refetch.
const channelCountryCache = new Map(); // channelId → code | null

async function fetchChannelCountries(channelIds) {
  const need = [...new Set(channelIds)].filter(id => id && !channelCountryCache.has(id));
  for (let i = 0; i < need.length; i += 50) {
    const chunk = need.slice(i, i + 50);
    const url = new URL('https://www.googleapis.com/youtube/v3/channels');
    url.searchParams.set('part',   'snippet');
    url.searchParams.set('id',     chunk.join(','));
    url.searchParams.set('fields', 'items(id,snippet(country))');
    url.searchParams.set('key',    cachedApiKey);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`YouTube channels ${res.status}`);
    const data = await res.json();
    const returned = new Set();
    for (const it of (data.items ?? [])) {
      channelCountryCache.set(it.id, it.snippet?.country ?? null);
      returned.add(it.id);
    }
    for (const id of chunk) if (!returned.has(id)) channelCountryCache.set(id, null);
  }
}

// --- Translation via Google Translate (no key required) ---

async function translateQuery(text, targetLang) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');       // auto-detect source language
  url.searchParams.set('tl', targetLang);   // our codes match Google's (zh-CN, zh-TW, etc.)
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const data = await res.json();
  // Response: [[[translatedChunk, original], ...], ...]
  return data[0].map(chunk => chunk[0]).join('');
}

function getVideoId(renderer) {
  const a = renderer.querySelector('a#video-title');
  if (!a?.href) return null;
  try { return new URL(a.href).searchParams.get('v'); }
  catch { return null; }
}

// Write style.display only when it actually changes — redundant writes retrigger
// MutationObservers (ours and other extensions') for no reason.
function setDisplay(el, value) {
  if (el.style.display !== value) el.style.display = value;
}
function setVisibility(el, value) {
  if (el.style.visibility !== value) el.style.visibility = value;
}

// Three renderer states:
//  • showRenderer    — decided MATCHING (or "always show"): visible, in layout.
//  • hideRenderer    — decided NON-matching: collapsed out of layout (display:none).
//  • hideUndecided   — not yet decided: INVISIBLE but still occupying its space.
// hideUndecided uses visibility (not display) on purpose: the card takes no visual
// form so the user never sees a pre-filter (wrong-language) result, yet the results
// list keeps its height — which is what stops YouTube's infinite scroll from running
// away (the historical "results keep refreshing" bug came from display:none-ing
// undecided cards, which emptied the list). A card is revealed (or collapsed) the
// instant its decision lands.
function showRenderer(el)   { setVisibility(el, '');       setDisplay(el, ''); }
function hideRenderer(el)   { setDisplay(el, 'none'); }
function hideUndecided(el)  { setDisplay(el, '');          setVisibility(el, 'hidden'); }
function applyDecision(el, display) { if (display === 'none') hideRenderer(el); else showRenderer(el); }

// --- Decision cache ---
// videoId → display value ('' = show, 'none' = hide), valid for decidedLang.
// YouTube re-renders the results list in several waves per page load; without
// this cache every wave re-hides all renderers and re-detects from scratch,
// which the user sees as the whole page blanking and reloading repeatedly.
// A decision is language-specific and video-specific, so it stays valid
// across navigations and re-renders until the user picks another language.

const decided = new Map();
let decidedKey = null; // the filterKey() the cache was built for (lang + countries + show-unknown)

// Per-NODE memory of the last FINAL decision applied to a renderer element
// (keyed by the DOM node, not the video id). When YouTube re-stamps/recycles a
// result card, its <a#video-title> anchor transiently detaches, so getVideoId()
// returns null for a moment. Without this, queueRenderer would hide a card that
// is currently visible — then show it again when the anchor rebinds — producing
// the "videos appear then disappear over and over" churn. A node that already
// has a final decision re-asserts it instead of blanking. Reset on language
// change because a node's correct decision depends on the selected language.
let nodeDecision = new WeakMap();

function getDecision(id) {
  const key = filterKey();
  if (decidedKey !== key) { decided.clear(); nodeDecision = new WeakMap(); decidedKey = key; }
  return decided.get(id);
}

function setDecision(id, display) {
  if (id) decided.set(id, display);
}

// Apply a FINAL decision to a renderer: remember it by node, cache it by id,
// and set the display. Provisional pre-hides (undecided) must NOT go through
// here — only genuine decisions, so a transient null id never re-asserts a
// provisional "none".
function decide(renderer, display, id) {
  nodeDecision.set(renderer, display);
  if (id) setDecision(id, display);
  applyDecision(renderer, display);
}

// --- Veil: blank the results while filtering, reveal the final set once ---
//
// The user must never see pre-filter (wrong-language) results, only the final set.
// Two layers:
//  1. Per-card: undecided cards are hideUndecided() (invisible, keep their space).
//  2. Global veil: while a /results load is settling, blank the whole results area
//     so even matching cards stay hidden until the page has settled — then reveal
//     everything at once.
//
// Why this is safe where the OLD veil wasn't: the old veil toggled the results
// container's own style repeatedly, which YouTube observed and re-stamped (a
// feedback storm), and it had no reliable "settled" signal so it blanked for
// seconds. Here the veil is a single class on <html> (CSS hides ytd-page-manager
// via inheritance — no attribute/childList mutation on YouTube's elements, so it
// can't trigger re-stamps), it is toggled at most twice per load (on, then off),
// it reveals on a real settle signal (no pending decisions + no new cards for a
// quiet window), and a hard max-timeout guarantees it can NEVER stay stuck blank.
// The masthead (and our language dropdown) sit outside ytd-page-manager, so the
// user can still switch language while the results are veiled.

const VEIL_CLASS    = 'ytlf-veil';
const VEIL_QUIET_MS = 900;    // no new cards + nothing pending for this long → settled
const VEIL_MAX_MS   = 6000;   // absolute cap on the blank duration — failsafe reveal

let veilActive    = false;    // results currently blanked
let veilUsed      = false;    // already revealed once for THIS load (never re-veil)
let veilQuietTimer = null;
let veilMaxTimer   = null;

function veilApply() {
  if (veilActive || veilUsed) return;
  if (!enabled || !anyFilterActive()) return;    // nothing being filtered → no veil
  if (window.location.pathname !== '/results') return;  // only the search page
  veilActive = true;
  document.documentElement.classList.add(VEIL_CLASS);
  clearTimeout(veilMaxTimer);
  veilMaxTimer = setTimeout(() => { ytlfLog('veil: max-timeout reveal'); veilReveal(); }, VEIL_MAX_MS);
  ytlfLog('veil: on');
}

function veilReveal() {
  if (!veilActive) return;
  veilActive = false;
  veilUsed = true;                               // don't blank again for this load
  clearTimeout(veilQuietTimer); veilQuietTimer = null;
  clearTimeout(veilMaxTimer);   veilMaxTimer = null;
  document.documentElement.classList.remove(VEIL_CLASS);
  ytlfLog('veil: revealed');
}

// Re-arm for the next results load (called on navigation / language change).
function veilReset() {
  veilActive = false;
  veilUsed = false;
  clearTimeout(veilQuietTimer); veilQuietTimer = null;
  clearTimeout(veilMaxTimer);   veilMaxTimer = null;
  document.documentElement.classList.remove(VEIL_CLASS);
}

// Reveal once settled. Called after each flush (decisions done) and after filterAll.
// The quiet timer is (re)started each call; if a new wave arrives it queues more
// pending work and the next flush restarts the timer, so we only reveal once the
// waves truly stop. pending/flushTimer guard against revealing mid-decision.
function veilScheduleReveal() {
  if (!veilActive) return;
  clearTimeout(veilQuietTimer);
  veilQuietTimer = setTimeout(() => {
    if (!veilActive) return;
    if (pending.size === 0 && !flushTimer) veilReveal();
    else veilScheduleReveal();                   // still busy — keep waiting (max-timer guards)
  }, VEIL_QUIET_MS);
}

// Fully reveal everything (used when the extension is turned off): drop the veil
// and clear every renderer's inline display/visibility so nothing stays hidden.
function revealAll() {
  veilReset();
  document.querySelectorAll(RENDERER_SEL).forEach(r => {
    r.style.removeProperty('display');
    r.style.removeProperty('visibility');
  });
}

// --- Batch queue ---

const pending = new Map(); // videoId → Set<Element>
let flushTimer = null;

function scheduleFlush() {
  // Do NOT reset an already-pending flush. YouTube re-stamps undecided cards
  // continuously, and resetting on every re-stamp kept pushing the flush back,
  // so cards stayed hidden for ~1s before being decided. Fire once, promptly.
  if (flushTimer) return;
  flushTimer = setTimeout(() => { flushTimer = null; flush(); }, BATCH_MS);
}

async function flush() {
  if (!enabled) { pending.clear(); return; }
  if (anyFilterActive() && pending.size > 0) {
    const batch = new Map(pending);
    pending.clear();
    ytlfLog(`flush: deciding ${batch.size} videos (apiKey=${!!cachedApiKey}, countries=${getCountries().length})`);
    await decideBatch(batch);
  } else {
    pending.clear();
  }
  veilScheduleReveal(); // decisions for this batch are in — maybe the page has settled
}

// Raw per-video metadata from videos.list — apiLang + channelId. Cached so a country
// change (or any re-decide) reuses it instead of re-spending videos.list quota.
const videoMeta = new Map(); // videoId → { apiLang, channelId }

// Decide ONE video from its metadata. Country gate first (search page + API key
// only), then the language gate — so a video shows only if it passes BOTH active
// filters. channelCountryCache must be populated before this when countryActive().
function decideVideoMeta(renderer, id, apiLang, channelId) {
  if (!enabled) { showRenderer(renderer); return; }

  if (countryActive() && cachedApiKey) {
    const wanted  = getCountries();
    const country = channelId ? channelCountryCache.get(channelId) : undefined;
    if (country == null) {                 // channel set no country (or unknown)
      if (!getShowUnknown()) { decide(renderer, 'none', id); return; }
      // show-unknown on → keep it; fall through to the language gate
    } else if (!wanted.includes(country)) {
      decide(renderer, 'none', id); return; // confirmed a country we didn't select
    }
    // country matches (or kept via show-unknown) → language gate
  }

  const lang = getLang();
  if (!lang)    { decide(renderer, '', id); return; }       // country-only / no filters
  if (apiLang)  { decide(renderer, isApiMatch(apiLang, lang) ? '' : 'none', id); return; }
  // Strict (we only reach here WITH an API key, so the user opted into precise audio
  // filtering): the API returned this video but set no audio language. Require an explicit
  // audio signal — trust the on-card audio badge if present; otherwise HIDE rather than
  // guess from the title, whose language routinely differs from the spoken audio (e.g. a
  // Russian-titled lesson with English audio). getBadgeLangCode returns null when there is
  // no badge, so null !== lang → hide.
  decide(renderer, getBadgeLangCode(renderer) === lang ? '' : 'none', id);
}

async function decideBatch(batch) {
  const lang = getLang();

  // No API key: language only (text/badge). Country can't be determined without it.
  if (!cachedApiKey) {
    for (const [id, renderers] of batch) {
      renderers.forEach(r => lang ? filterByText(r, id) : showRenderer(r));
    }
    return;
  }

  const ids = [...batch.keys()];

  // 1) videos.list for ids we haven't fetched yet → apiLang + channelId.
  const missing = ids.filter(id => !videoMeta.has(id));
  for (let i = 0; i < missing.length; i += 50) {
    const chunk = missing.slice(i, i + 50);
    try {
      const data = await fetchMetadata(chunk);
      const returned = new Set();
      for (const item of (data.items ?? [])) {
        returned.add(item.id);
        videoMeta.set(item.id, {
          apiLang:   item.snippet.defaultAudioLanguage || null, // audio track ONLY — never defaultLanguage (that's the title's language, not the spoken audio)
          channelId: item.snippet.channelId || null,
        });
      }
      // IDs the API didn't return (private/deleted/embargoed) — no metadata.
      for (const id of chunk) if (!returned.has(id)) videoMeta.set(id, { apiLang: null, channelId: null });
    } catch {
      // videos.list failed for this chunk → degrade to language-only and drop these
      // from the country pass so a transient API error never hides everything.
      for (const id of chunk) (batch.get(id) ?? new Set()).forEach(r => lang ? filterByText(r, id) : showRenderer(r));
      chunk.forEach(id => batch.delete(id));
    }
  }

  // 2) channels.list (cached) for the channels we still need countries for.
  if (countryActive()) {
    const chIds = [...batch.keys()].map(id => videoMeta.get(id)?.channelId).filter(Boolean);
    try { await fetchChannelCountries(chIds); }
    catch { /* channels.list failed — decideVideoMeta treats unknown per the toggle */ }
  }

  // 3) Decide every video from its (now cached) metadata.
  for (const [id, renderers] of batch) {
    const meta = videoMeta.get(id) || { apiLang: null, channelId: null };
    renderers.forEach(r => decideVideoMeta(r, id, meta.apiLang, meta.channelId));
  }
}

// --- Main entry point per renderer ---

function queueRenderer(renderer) {
  if (!enabled || !anyFilterActive()) { showRenderer(renderer); return; }

  const id = getVideoId(renderer);

  // Transient re-stamp/recycle: the <a#video-title> anchor briefly detaches, so
  // getVideoId() is momentarily null. If this exact node already has a final
  // decision, re-assert it rather than disturbing a settled card. This makes a
  // transient null id incapable of un-deciding a settled node.
  if (id === null) {
    const remembered = nodeDecision.get(renderer);
    if (remembered !== undefined) { applyDecision(renderer, remembered); return; }
  }

  if (!id) {
    // Playlist cards have no video ID and no audio language — always show them.
    if (renderer.querySelector('a[href*="/playlist?"]')) { decide(renderer, ''); return; }
    // Unhydrated shell — pre-hide INVISIBLY (keeps its space, no layout collapse)
    // until the title binds and the observer requeues it.
    if (!renderer.querySelector('#video-title')) { hideUndecided(renderer); return; }
    // No video id → the channel can't be resolved, so the country filter can't apply.
    // Decide on language alone when a language is selected; otherwise show.
    if (getLang()) { hideUndecided(renderer); filterByText(renderer); }
    else showRenderer(renderer);
    return;
  }

  // Already decided for this video + language — apply instantly, no blink.
  const cached = getDecision(id);
  if (cached !== undefined) { decide(renderer, cached, id); return; }

  // Undecided: pre-hide INVISIBLY (visibility:hidden, NOT display:none) so the user
  // never sees this pre-filter card, while the card keeps its space so the results
  // list can't collapse and send YouTube's infinite scroll into a refresh loop.
  // flush() reveals it (matching) or collapses it (non-matching) once decided.
  hideUndecided(renderer);
  if (!pending.has(id)) pending.set(id, new Set());
  pending.get(id).add(renderer);
  scheduleFlush();
}

function filterAll() {
  pending.clear();
  clearTimeout(flushTimer); flushTimer = null;
  veilApply(); // blank the results area up front, before any pre-filter card shows
  const renderers = document.querySelectorAll(RENDERER_SEL);
  renderers.forEach(queueRenderer);
  ytlfLog(`filterAll: ${renderers.length} renderers, ${decided.size} cached, ${pending.size} pending`);
  if (pending.size > 0) scheduleFlush();
  else veilScheduleReveal(); // nothing to decide (all cached / none) — reveal soon
}

// --- Widget ---

function buildWidget() {
  const wrapper = document.createElement('div');
  wrapper.id = 'ytlf';
  wrapper.dataset.enabled = enabled ? '1' : '0';

  // ── Custom dropdown ──────────────────────────────────────
  const dropdown = document.createElement('div');
  dropdown.id = 'ytlf-dropdown';

  const trigger = document.createElement('button');
  trigger.id = 'ytlf-trigger';
  trigger.title = `YouTube Language Filter v${chrome.runtime.getManifest().version}`;
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const triggerLabel = document.createElement('span');
  triggerLabel.id = 'ytlf-trigger-label';

  const triggerArrow = document.createElement('span');
  triggerArrow.id = 'ytlf-trigger-arrow';
  triggerArrow.innerHTML =
    '<svg width="10" height="6" viewBox="0 0 10 6" fill="none">' +
    '<path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5"' +
    ' stroke-linecap="round" stroke-linejoin="round"/></svg>';

  trigger.appendChild(triggerLabel);
  trigger.appendChild(triggerArrow);

  const panel = document.createElement('div');
  panel.id = 'ytlf-panel';
  panel.setAttribute('role', 'listbox');

  // ── Search bar: type to filter, Enter selects the highlighted match ──
  const search = document.createElement('input');
  search.id = 'ytlf-search';
  search.type = 'text';
  search.placeholder = 'Search languages…';
  search.autocomplete = 'off';
  search.spellcheck = false;
  panel.appendChild(search);

  for (const { code, label } of LANGUAGES) {
    const opt = document.createElement('div');
    opt.className = 'ytlf-opt';
    opt.setAttribute('role', 'option');
    opt.dataset.value = code;
    opt.textContent = label;
    panel.appendChild(opt);
  }

  dropdown.appendChild(trigger);
  dropdown.appendChild(panel);

  let activeOpt = null; // keyboard-highlighted option

  function visibleOpts() {
    return [...panel.querySelectorAll('.ytlf-opt')].filter(o => o.style.display !== 'none');
  }

  function setActive(opt) {
    panel.querySelectorAll('.ytlf-opt.active').forEach(o => o.classList.remove('active'));
    activeOpt = opt ?? null;
    if (activeOpt) {
      activeOpt.classList.add('active');
      activeOpt.scrollIntoView({ block: 'nearest' });
    }
  }

  // Filter options by the search text. Highlight the best match:
  // a label starting with the text beats one merely containing it.
  function applyFilter() {
    const q = search.value.trim().toLowerCase();
    let firstPrefix = null, firstMatch = null;
    panel.querySelectorAll('.ytlf-opt').forEach(o => {
      const label = o.textContent.toLowerCase();
      const match = !q || label.includes(q);
      o.style.display = match ? '' : 'none';
      if (match && !firstMatch) firstMatch = o;
      if (match && q && !firstPrefix && label.startsWith(q)) firstPrefix = o;
    });
    setActive(q ? (firstPrefix ?? firstMatch) : null);
  }

  search.addEventListener('input', applyFilter);
  search.addEventListener('keydown', (e) => {
    e.stopPropagation(); // keep keystrokes away from YouTube's hotkeys
    if (e.key === 'Enter') {
      const target = activeOpt ?? visibleOpts()[0];
      if (target) target.click(); // runs the full select → translate → search flow
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const opts = visibleOpts();
      if (!opts.length) return;
      const i = opts.indexOf(activeOpt);
      setActive(e.key === 'ArrowDown'
        ? opts[Math.min(i + 1, opts.length - 1)]
        : opts[Math.max(i - 1, 0)]);
    } else if (e.key === 'Escape') {
      closePanel();
    }
  });

  // Sync label + selected highlight to current getLang()
  function syncSelected() {
    const lang = getLang();
    triggerLabel.textContent = LANGUAGES.find(l => l.code === lang)?.label ?? 'All Languages';
    panel.querySelectorAll('.ytlf-opt').forEach(o =>
      o.classList.toggle('selected', o.dataset.value === lang)
    );
  }

  function openPanel() {
    document.getElementById('ytlf-c-panel')?.classList.remove('open'); // close the country panel
    panel.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    search.value = '';
    applyFilter();
    search.focus();
    panel.querySelector('.ytlf-opt.selected')?.scrollIntoView({ block: 'nearest' });
  }
  function closePanel() {
    panel.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  let ddBusy = false; // prevent double-fire during translation

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (ddBusy) return;
    panel.classList.contains('open') ? closePanel() : openPanel();
  });

  panel.addEventListener('click', async (e) => {
    e.stopPropagation(); // clicks inside the panel (e.g. the search box) must not close it
    const opt = e.target.closest('.ytlf-opt');
    if (!opt || ddBusy) return;
    const newLang = opt.dataset.value;
    setLang(newLang);
    syncSelected();
    closePanel();

    // Switching language automatically re-runs the search: translate the user's
    // ORIGINAL query into the new language and navigate once. The user never has
    // to also press Search. We always translate from the original text (never a
    // prior translation), on both the results page and a watch page reached from
    // a search. "All Languages" (newLang === '') skips this and just unfilters.
    if (newLang && (location.pathname === '/results' || location.pathname === '/watch')) {
      const original = getOriginalQuery() || (
        location.pathname === '/results'
          ? (new URL(location.href).searchParams.get('search_query') ?? '')
          : (document.querySelector('input[name="search_query"], input#search')?.value.trim() ?? '')
      );
      if (original) {
        ddBusy = true;
        wrapper.style.opacity = '0.5';
        try {
          if (await translateAndNavigate(original, newLang)) return;
        } finally { ddBusy = false; wrapper.style.opacity = ''; }
      }
    }
    filterAll();
  });

  // Close when clicking anywhere outside the dropdown
  document.addEventListener('click', closePanel);

  syncSelected();

  // ── Light / dark toggle ──────────────────────────────────
  const toggle = document.createElement('button');
  toggle.id = 'ytlf-toggle';
  toggle.title = 'Toggle light / dark';
  toggle.addEventListener('click', () => {
    const next = wrapper.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(wrapper, next);
  });

  wrapper.appendChild(dropdown);
  wrapper.appendChild(buildCountryDropdown());
  wrapper.appendChild(toggle);

  applyTheme(wrapper, resolveTheme());
  return wrapper;
}

// ── Country multi-select (search results only) ───────────────────────────────
// A tag-input combobox: type to filter, click/Enter to toggle, ✕ or Backspace to
// remove. Selected countries show as chips with their full names. Same visual
// language as the existing dropdown. A toggle keeps/drops channels with no country.
function buildCountryDropdown() {
  const dd = document.createElement('div');
  dd.id = 'ytlf-c-dropdown';

  const trig = document.createElement('button');
  trig.id = 'ytlf-c-trigger';
  trig.title = 'Filter by channel country (search results)';
  trig.setAttribute('aria-haspopup', 'listbox');
  trig.setAttribute('aria-expanded', 'false');
  const trigLabel = document.createElement('span'); trigLabel.id = 'ytlf-c-label';
  const trigArrow = document.createElement('span'); trigArrow.id = 'ytlf-c-arrow';
  trigArrow.innerHTML =
    '<svg width="10" height="6" viewBox="0 0 10 6" fill="none">' +
    '<path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5"' +
    ' stroke-linecap="round" stroke-linejoin="round"/></svg>';
  trig.append(trigLabel, trigArrow);

  const panel = document.createElement('div');
  panel.id = 'ytlf-c-panel';
  panel.setAttribute('role', 'listbox');

  // chips + search input share one box (the tag input)
  const tags = document.createElement('div'); tags.id = 'ytlf-c-tags';
  const search = document.createElement('input');
  search.id = 'ytlf-c-search'; search.type = 'text';
  search.placeholder = 'Search countries…'; search.autocomplete = 'off'; search.spellcheck = false;
  tags.appendChild(search);
  panel.appendChild(tags);

  const list = document.createElement('div'); list.id = 'ytlf-c-list';
  for (const { code, name } of COUNTRIES) {
    const opt = document.createElement('div');
    opt.className = 'ytlf-c-opt'; opt.setAttribute('role', 'option'); opt.dataset.code = code;
    const nm = document.createElement('span'); nm.className = 'ytlf-c-name'; nm.textContent = name;
    const cd = document.createElement('span'); cd.className = 'ytlf-c-code'; cd.textContent = code;
    opt.append(nm, cd);
    list.appendChild(opt);
  }
  panel.appendChild(list);

  const unkRow = document.createElement('label'); unkRow.id = 'ytlf-c-unknown';
  const unkText = document.createElement('span'); unkText.className = 'ytlf-c-unknown-text';
  unkText.textContent = 'Show results from channels without a country';
  const unkSwitch = document.createElement('span'); unkSwitch.className = 'ytlf-switch';
  const unkCheck = document.createElement('input'); unkCheck.type = 'checkbox'; unkCheck.checked = getShowUnknown();
  const unkSlider = document.createElement('span'); unkSlider.className = 'ytlf-slider';
  unkSwitch.append(unkCheck, unkSlider);
  unkRow.append(unkText, unkSwitch); // text left, switch right (like the popup toggles)
  panel.appendChild(unkRow);

  const hint = document.createElement('p'); hint.id = 'ytlf-c-hint';
  hint.textContent = 'Add a YouTube Data API key in the extension popup to filter by country.';
  panel.appendChild(hint);

  dd.append(trig, panel);

  let activeOpt = null;
  const allOpts = () => [...list.querySelectorAll('.ytlf-c-opt')];
  const visibleOpts = () => allOpts().filter(o => o.style.display !== 'none');
  function setActive(o) {
    list.querySelectorAll('.ytlf-c-opt.active').forEach(x => x.classList.remove('active'));
    activeOpt = o ?? null;
    if (activeOpt) { activeOpt.classList.add('active'); activeOpt.scrollIntoView({ block: 'nearest' }); }
  }

  function syncLabel() {
    const sel = getCountries();
    trigLabel.textContent = sel.length === 0 ? 'Countries'
      : sel.length === 1 ? (COUNTRY_NAME[sel[0]] ?? sel[0])
      : `${sel.length} countries`;
    dd.dataset.has = sel.length ? '1' : '0';
  }

  function renderChips() {
    tags.querySelectorAll('.ytlf-c-chip').forEach(c => c.remove());
    const sel = getCountries();
    for (const code of sel) {
      const chip = document.createElement('span'); chip.className = 'ytlf-c-chip'; chip.dataset.code = code;
      const t = document.createElement('span'); t.className = 'ytlf-c-chip-name'; t.textContent = COUNTRY_NAME[code] ?? code;
      const x = document.createElement('button'); x.className = 'ytlf-c-x'; x.type = 'button'; x.textContent = '×'; x.title = 'Remove';
      chip.append(t, x);
      tags.insertBefore(chip, search);
    }
    allOpts().forEach(o => o.classList.toggle('selected', sel.includes(o.dataset.code)));
    syncLabel();
  }

  function toggleCountry(code) {
    const sel = getCountries();
    const i = sel.indexOf(code);
    if (i >= 0) sel.splice(i, 1); else sel.push(code);
    setCountries(sel);
    renderChips();
    if (location.pathname === '/results') filterAll(); // re-decide current results
  }

  function applyCFilter() {
    const q = search.value.trim().toLowerCase();
    let firstPrefix = null, firstMatch = null;
    allOpts().forEach(o => {
      const name = o.querySelector('.ytlf-c-name').textContent.toLowerCase();
      const code = o.dataset.code.toLowerCase();
      const match = !q || name.includes(q) || code.includes(q);
      o.style.display = match ? '' : 'none';
      if (match && !firstMatch) firstMatch = o;
      if (match && q && !firstPrefix && name.startsWith(q)) firstPrefix = o;
    });
    setActive(q ? (firstPrefix ?? firstMatch) : null);
  }

  function openPanel() {
    document.getElementById('ytlf-panel')?.classList.remove('open'); // close the language panel
    hint.style.display = cachedApiKey ? 'none' : 'block';
    panel.classList.add('open');
    trig.setAttribute('aria-expanded', 'true');
    search.value = ''; applyCFilter(); renderChips(); search.focus();
  }
  function closePanel() { panel.classList.remove('open'); trig.setAttribute('aria-expanded', 'false'); }

  trig.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.contains('open') ? closePanel() : openPanel();
  });

  search.addEventListener('input', applyCFilter);
  search.addEventListener('keydown', (e) => {
    e.stopPropagation(); // keep keystrokes away from YouTube's hotkeys
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = activeOpt ?? visibleOpts()[0];
      if (target) { toggleCountry(target.dataset.code); search.value = ''; applyCFilter(); }
    } else if (e.key === 'Backspace' && search.value === '') {
      const sel = getCountries();
      if (sel.length) toggleCountry(sel[sel.length - 1]); // backspace removes the last chip
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const vis = visibleOpts(); if (!vis.length) return;
      const i = vis.indexOf(activeOpt);
      setActive(e.key === 'ArrowDown' ? vis[Math.min(i + 1, vis.length - 1)] : vis[Math.max(i - 1, 0)]);
    } else if (e.key === 'Escape') { closePanel(); }
  });

  list.addEventListener('click', (e) => {
    e.stopPropagation();
    const o = e.target.closest('.ytlf-c-opt'); if (!o) return;
    toggleCountry(o.dataset.code);
    search.focus(); // stay open for multi-select
  });

  tags.addEventListener('click', (e) => {
    e.stopPropagation();
    const x = e.target.closest('.ytlf-c-x');
    if (x) toggleCountry(x.parentElement.dataset.code);
    else search.focus();
  });

  unkRow.addEventListener('click', (e) => e.stopPropagation());
  unkCheck.addEventListener('change', () => {
    setShowUnknown(unkCheck.checked);
    if (location.pathname === '/results') filterAll();
  });

  panel.addEventListener('click', (e) => e.stopPropagation()); // inner clicks keep it open
  document.addEventListener('click', closePanel);              // outside click closes it

  renderChips();
  return dd;
}

let widgetRetryCount = 0;
function injectWidget() {
  if (!enabled) { document.getElementById('ytlf')?.remove(); return; } // off → no widget at all
  const existing = document.getElementById('ytlf');
  if (existing) {
    existing.dataset.enabled = '1';
    widgetRetryCount = 0;
    return;
  }
  const center = document.querySelector('#center');
  if (!center) {
    // #center not ready yet (e.g. extension enabled on already-open tab) — retry
    if (widgetRetryCount++ < 10) setTimeout(injectWidget, 300);
    return;
  }
  widgetRetryCount = 0;
  center.appendChild(buildWidget());
}

// --- MutationObserver: catches renderers added by infinite scroll ---

const observer = new MutationObserver((mutations) => {
  if (!isContextValid()) { observer.disconnect(); return; }
  if (!enabled) return; // extension off — do absolutely nothing

  // Shorts/Playables scanner — debounced to avoid thrashing
  if (hideShorts || enabled) {
    clearTimeout(shortsTagTimer);
    shortsTagTimer = setTimeout(() => {
      if (hideShorts) tagShorts();
      if (enabled)    tagPlayables();
    }, 150);
  }

  // Re-apply engagement hiding to newly added elements (infinite scroll, SPA loads)
  if (hideEngagements && enabled) {
    clearTimeout(engagementsTimer);
    engagementsTimer = setTimeout(applyEngagementsDom, 150);
  }

  if (!anyFilterActive() || !isFilteredPage()) return;
  // Collect the unique renderers touched by this mutation batch, then process
  // each ONCE. YouTube streams many descendant nodes (thumbnails, badges,
  // metadata) into the same card; without de-duping we'd call queueRenderer
  // dozens of times per card per batch — the "observer queued 161 renderers"
  // storm. A Set collapses that to one call per affected card.
  const touched = new Set();
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.matches(RENDERER_SEL)) {
        touched.add(node);
      } else {
        node.querySelectorAll(RENDERER_SEL).forEach(r => touched.add(r));
        // Data bound INTO an existing renderer (Polymer hydration / recycling):
        // requeue the host so shells get decided once their title binds.
        const host = node.closest(RENDERER_SEL);
        if (host) touched.add(host);
      }
    }
  }
  touched.forEach(queueRenderer);
});

// --- Force original audio track when language filter is active ---

// Returns 'stop' when done (or nothing to do), 'retry' when tracks aren't ready yet.
// Strategy: ONLY select tracks that YouTube explicitly labels "original"
// (e.g. "Russian original", "Italian original"). Never infer from absence of "dubbed" —
// that incorrectly matches auto-dubbed tracks like "English (US)" whose displayName
// contains no "dubbed" text, causing the extension to actively select the wrong track.
function switchToOriginalAudio() {
  if (!isContextValid()) return 'stop';
  if (window.location.pathname !== '/watch') return 'stop';

  const player = document.querySelector('#movie_player');
  if (typeof player?.getAvailableAudioTracks !== 'function') return 'retry';

  const tracks = player.getAvailableAudioTracks();
  if (!tracks?.length) return 'retry';

  // Find a track explicitly labeled "original" by YouTube
  const original = tracks.find(t => (t.displayName ?? '').toLowerCase().includes('original'));

  if (!original) {
    // Single track with no "original" label → YouTube may still be loading tracks
    // Multiple tracks with no "original" label → single-language video, nothing to do
    return tracks.length === 1 ? 'retry' : 'stop';
  }

  // Already switched for this video — do NOT re-apply. Re-applying setAudioTrack
  // re-flips the caption track (and would fight a caption choice the user just made).
  if (audioDoneFor === location.href) return 'stop';

  if (typeof player.setAudioTrack === 'function') {
    // The audio switch must not, by itself, turn subtitles ON. If captions were
    // OFF, keep them off after the switch. If they were ON, the language is left to
    // normalizeCaptions(), which snaps to the video's FIRST caption option (so a
    // stale remembered language never sticks).
    let prevWasOff = false;
    try {
      const prev = player.getOption?.('captions', 'track');
      prevWasOff = !!prev && Object.keys(prev).length === 0; // {} = captions off
    } catch { /* captions module not ready */ }

    player.setAudioTrack(original);
    audioDoneFor = location.href;

    if (prevWasOff && typeof player.setOption === 'function') {
      const keepOff = () => {
        try {
          const now = player.getOption('captions', 'track');
          if (now && Object.keys(now).length > 0) player.setOption('captions', 'track', {});
        } catch { /* ignore */ }
      };
      keepOff(); setTimeout(keepOff, 150); setTimeout(keepOff, 500);
    }
  }
  return 'stop';
}

// Single timer — prevents multiple concurrent retry chains from piling up
// when yt-page-data-updated fires several times during page load.
let audioTimer = null;
// The watch URL we've already switched audio for — guards against re-applying
// setAudioTrack (and re-flipping captions) on YouTube's repeated page-data events.
let audioDoneFor = null;

// Faster early retries to catch the track before YouTube auto-selects dubbed audio.
const AUDIO_RETRY_MS = [100, 200, 300, 500, 1000, 1000, 1500, 2000, 2000, 2000];

function scheduleAudioSwitch(attempt = 0) {
  if (!isContextValid()) return;
  if (!enabled) return; // extension off — leave the audio track alone
  if (window.location.pathname !== '/watch') return;
  if (attempt >= AUDIO_RETRY_MS.length) return;

  if (switchToOriginalAudio() === 'retry') {
    clearTimeout(audioTimer);
    audioTimer = setTimeout(() => scheduleAudioSwitch(attempt + 1), AUDIO_RETRY_MS[attempt]);
  }
}

// Re-run on every YouTube data update — audio switch + early Shorts/Playables tagging
// (yt-page-data-updated fires before yt-navigate-finish, so tagging here reduces flash)
document.addEventListener('yt-page-data-updated', () => {
  if (!enabled) return; // extension off — do nothing
  scheduleAudioSwitch(0);
  if (hideShorts) tagShorts();
  tagPlayables();
});

// --- Subtitle language: always the video's FIRST caption option, never a stale one ---
//
// YouTube remembers the caption LANGUAGE you last used and auto-applies it to every
// later video (a sticky account/cookie preference). That is why subtitles kept
// showing up in a past language (e.g. Dutch) on unrelated videos. We can't wipe
// YouTube's stored preference, but we override its effect: whenever captions turn ON,
// snap the track to the video's first listed caption option (`tracklist[0]` — the
// video's own/native captions). We only act on the OFF→ON edge (and the first time we
// see captions on after a navigation), so a language the user deliberately picks
// afterwards is respected. We never turn captions on ourselves.
let capPrevOn = null; // last observed on/off state (null = not yet observed this video)

function normalizeCaptions() {
  if (!isContextValid() || !enabled) return;
  if (window.location.pathname !== '/watch') { capPrevOn = null; return; }
  const player = document.querySelector('#movie_player');
  if (typeof player?.getOption !== 'function') return;

  let track, list;
  try {
    track = player.getOption('captions', 'track');
    list  = player.getOption('captions', 'tracklist');
  } catch { return; } // captions module not ready yet

  const on = !!track && Object.keys(track).length > 0;
  if (on) {
    const first = (Array.isArray(list) && list.length) ? list[0] : null;
    const edge  = capPrevOn === null || capPrevOn === false; // first-seen-on or OFF→ON
    if (first && edge && track.languageCode !== first.languageCode &&
        typeof player.setOption === 'function') {
      try { player.setOption('captions', 'track', first); } catch { /* ignore */ }
    }
  }
  capPrevOn = on;
}
setInterval(normalizeCaptions, 700);

// --- Search query language enforcement ---
//
// The extension guarantees the user only ever sees results in the selected
// language by translating the query BEFORE YouTube navigates. The search submit
// is intercepted (Enter / search button), the query is translated, and we
// navigate exactly once to the translated query — so no untranslated results
// ever render and there is no second "redirect" page load. ensureQueryInLang()
// is only a fallback for the rare submit paths we can't intercept (autocomplete
// click, voice search, a hand-edited URL).

const ORIG_QUERY_KEY      = 'ytlf_orig_query';      // the user's untranslated query
const LAST_TRANSLATED_KEY = 'ytlf_last_translated'; // the translated query we navigated to

function getOriginalQuery() {
  return sessionStorage.getItem(ORIG_QUERY_KEY) || null;
}

// Resolve true when CLD is confident `text` is already in `lang`, so translation
// (and the navigation it would cause) can be skipped.
function isInLang(text, lang) {
  return new Promise(resolve => {
    if (!isContextValid()) { resolve(false); return; }
    try {
      chrome.i18n.detectLanguage(text, ({ languages }) => {
        const top = languages?.[0];
        resolve(!!(top && top.percentage >= MIN_CONF && isCldMatch(top.language, lang)));
      });
    } catch { resolve(false); }
  });
}

// One navigation at a time — stops the dropdown change and the init() debounce
// from both firing a navigation for the same submit. Cleared on yt-navigate-finish
// (the soft navigation completed). A failsafe timer clears it too, so a "finish"
// that never arrives can't wedge the extension into never-navigating-again.
let navigating = false;
let navFailsafe = null;
function beginNavigating() {
  navigating = true;
  clearTimeout(navFailsafe);
  navFailsafe = setTimeout(() => { navigating = false; }, 5000);
}
function endNavigating() {
  navigating = false;
  clearTimeout(navFailsafe);
}

// Navigate to the `target` search results the way YouTube's own search box does:
// a SOFT, in-app navigation that leaves persistent UI intact — most importantly a
// video playing in the MINIPLAYER (and the masthead) — instead of window.location
// .assign(), a full page load that tears the miniplayer down and stops playback.
// We drive YouTube's internal SPA router via its `yt-navigate` event. If the page
// doesn't pick it up (an unknown/future build), we fall back to a hard navigation
// after a short grace period so search still works, just without the soft-nav win.
function spaSearchNavigate(target) {
  const url = new URL('/results', location.origin);
  url.searchParams.set('search_query', target);
  const hardNav = () => window.location.assign(url.toString());

  const app = document.querySelector('ytd-app');
  if (!app) { hardNav(); return; }

  // yt-navigate-start firing (or the address bar landing on our query) tells us
  // YouTube accepted the soft navigation, so we must NOT also hard-navigate.
  let accepted = false;
  const onStart = () => { accepted = true; };
  document.addEventListener('yt-navigate-start', onStart, { once: true });

  app.dispatchEvent(new CustomEvent('yt-navigate', {
    bubbles: true,
    composed: true,
    detail: {
      endpoint: {
        commandMetadata: {
          webCommandMetadata: {
            url: url.pathname + url.search,
            webPageType: 'WEB_PAGE_TYPE_SEARCH',
            rootVe: 4724,
          },
        },
        searchEndpoint: { query: target },
      },
    },
  }));

  setTimeout(() => {
    document.removeEventListener('yt-navigate-start', onStart);
    const here = new URL(location.href);
    const onTarget = here.pathname === '/results' &&
      here.searchParams.get('search_query') === target;
    if (!accepted && !onTarget) hardNav(); // router ignored us — fall back
  }, 300);
}

// Translate `original` into `lang` (skipping translation when it is already in
// that language) and navigate ONCE to /results for the final query. Persists the
// original->translated mapping so the page we land on recognises the query as
// already translated and never translates it again — which is what prevents the
// old double-navigate loop. Returns true if it navigated away (caller must stop).
async function translateAndNavigate(original, lang) {
  original = (original || '').trim();
  if (!original) return false;
  if (navigating) return true;

  let target = original;
  if (lang && !(await isInLang(original, lang))) {
    try {
      const t = (await translateQuery(original, lang)).trim();
      // Ignore trivial differences (capitalisation/punctuation) so we don't
      // reload to an essentially identical query.
      if (t && t.toLowerCase() !== original.toLowerCase()) target = t;
    } catch { /* translation failed — search the original query instead */ }
  }

  sessionStorage.setItem(ORIG_QUERY_KEY, original);
  sessionStorage.setItem(LAST_TRANSLATED_KEY, target);

  const cur = new URL(location.href);
  if (cur.pathname === '/results' &&
      cur.searchParams.get('search_query') === target) {
    return false; // already exactly here — nothing to navigate; caller filters
  }

  ytlfLog(`NAVIGATE: "${original}" -> "${target}" (${lang || 'all'})`);
  beginNavigating();
  spaSearchNavigate(target);
  return true;
}

// Fallback for a /results load whose query slipped through untranslated
// (autocomplete click, voice search, hand-edited URL). Returns true if it
// navigated (caller must not filter yet).
async function ensureQueryInLang(lang) {
  const query = new URL(location.href).searchParams.get('search_query') ?? '';
  if (!query) return false;
  // We navigated here ourselves with an already-translated query — don't redo it.
  if (query === sessionStorage.getItem(LAST_TRANSLATED_KEY)) {
    ytlfLog('ensureQuery: already on translated page');
    return false;
  }
  return await translateAndNavigate(query, lang);
}

// --- Intercept the search submission so translation happens BEFORE navigation ---
// This is what removes the flash of untranslated results and the second page
// load: we stop YouTube's own navigation, translate, then navigate once. Enter is
// the version-independent path; the button selectors are best-effort. Anything
// not caught here still lands correctly via ensureQueryInLang() on init.

function searchInputEl() {
  return document.querySelector(
    'input#search, input[name="search_query"], ytd-searchbox input, yt-searchbox input'
  );
}

function isSearchInput(el) {
  return !!el && el.tagName === 'INPUT' &&
    (el.id === 'search' || el.name === 'search_query' ||
     !!el.closest('ytd-searchbox, yt-searchbox, #search-form'));
}

async function interceptSubmit(e, query) {
  // Stop YouTube's navigation synchronously, before any untranslated load starts.
  e.preventDefault();
  e.stopImmediatePropagation();
  if (!(await translateAndNavigate(query, getLang())) && isFilteredPage()) {
    filterAll(); // already on this exact query in this language — just re-filter
  }
}

// Enter pressed inside the search box.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
  if (!enabled || !getLang()) return;            // All Languages → normal search
  if (!isSearchInput(e.target)) return;
  const query = e.target.value.trim();
  if (!query) return;
  interceptSubmit(e, query);
}, true);

// Click on the magnifying-glass search button (classic + current search boxes).
document.addEventListener('click', (e) => {
  if (!enabled || !getLang()) return;
  const btn = e.target.closest('#search-icon-legacy, .ytSearchboxComponentSearchButton');
  if (!btn) return;
  const query = (searchInputEl()?.value ?? '').trim();
  if (!query) return;
  interceptSubmit(e, query);
}, true);

// --- init ---

async function init() {
  ytlfLog(`init @ ${location.href}`);

  if (!enabled) {
    // Off → no widget, no veil, no body classes, no inline styles. Truly inert.
    document.getElementById('ytlf')?.remove();
    applyDisplayToggles();
    revealAll();
    return;
  }

  injectWidget();
  applyDisplayToggles();

  // On the results page, ensure the query matches the selected language before filtering.
  if (window.location.pathname === '/results') {
    if (anyFilterActive()) veilApply(); // blank now (covers country-only too), before paint
    const lang = getLang();
    if (lang && await ensureQueryInLang(lang)) return; // redirecting — don't filter yet
  }

  if (isFilteredPage()) filterAll();
  if (window.location.pathname === '/watch') scheduleAudioSwitch();
}

// Re-apply body classes the moment navigation starts so CSS takes effect before
// the new page content is rendered (prevents Shorts flash-of-content).
document.addEventListener('yt-navigate-start', () => {
  ytlfLog(`yt-navigate-start @ ${location.href}`);
  applyDisplayToggles();
  veilReset();        // a new load is starting — re-arm the veil for it
  audioDoneFor = null; // …and re-arm the original-audio switch for the next video
  capPrevOn = null;    // …and re-snap captions to the first option on the next video
});

// Debounce yt-navigate-finish: YouTube fires it multiple times per navigation.
// Without debouncing, concurrent init() calls both run ensureQueryInLang,
// both translate the query, and both call location.assign → infinite loop.
let initTimer = null;
document.addEventListener('yt-navigate-finish', () => {
  ytlfLog(`yt-navigate-finish @ ${location.href}`);
  endNavigating();   // soft navigation completed — allow the next one
  clearTimeout(initTimer);
  initTimer = setTimeout(init, 50);
});
observer.observe(document.body, { childList: true, subtree: true });

// Failsafe for the guide veil: it is normally lifted the instant applyEngagementsDom
// tags the guide. If a future YouTube markup change ever stopped that path, this
// guarantees the guide can never stay invisible — reveal unconditionally after 4s.
setTimeout(() => document.documentElement.classList.add('ytlf-eng-ready'), 4000);

init();
