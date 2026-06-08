(function () {
  const LANG_KEY = "babusgatos:lang";
  const SUPPORTED = ["hu", "de", "en"];
  const LOCALE = { hu: "hu-HU", de: "de-DE", en: "en-GB" };

  const WEEKDAYS = [
    { keys: ["vasárnap", "vasarnap"], hu: "Vasárnap", de: "Sonntag", en: "Sunday" },
    { keys: ["hétfő", "hetfo"], hu: "Hétfő", de: "Montag", en: "Monday" },
    { keys: ["kedd"], hu: "Kedd", de: "Dienstag", en: "Tuesday" },
    { keys: ["szerda"], hu: "Szerda", de: "Mittwoch", en: "Wednesday" },
    { keys: ["csütörtök", "csutortok"], hu: "Csütörtök", de: "Donnerstag", en: "Thursday" },
    { keys: ["péntek", "pentek"], hu: "Péntek", de: "Freitag", en: "Friday" },
    { keys: ["szombat"], hu: "Szombat", de: "Samstag", en: "Saturday" },
  ];

  const MESSAGES = {
    hu: {
      "meta.title": "Babusgatós — mozgó furgon",
      "header.tagline": "Merre jár a Babusgatós furgon?",
      "nav.map": "Térkép",
      "nav.stock": "Készlet",
      "nav.order": "Előrendelés",
      "nav.profile": "Profil",
      "lang.label": "Nyelv",
      "map.hint": "Keress települést — menetrend és térkép betöltése.",
      "map.notToday": "Ezen a napon nem látogatunk el hozzátok, de az alábbi időpontban megtalálsz minket a településeden:",
      "map.vanLiveAria": "Élő furgon térkép",
      "map.openMap": "Térkép megnyitása",
      "map.liveVanMap": "Élő furgon térkép",
      "tracker.myTown": "Településem",
      "tracker.townLabel": "Település:",
      "tracker.searchPlaceholder": "Keresés településre…",
      "tracker.searchShort": "Keresés…",
      "tracker.statusEmpty": "Írj be településnevet a menetrendhez",
      "tracker.arrivalLabel": "Várható érkezés",
      "tracker.arrivalUnavailable": "Időpont egyenlőre nem elérhető",
      "tracker.liveTracking": "Élő követés: {town} · GPS: {freshness}",
      "tracker.liveTrackingStale": "Élő követés: {town} · Utolsó jel: {freshness} — ellenőrizd az OwnTracks-et",
      "tracker.schedule": "Menetrend: {town}",
      "tracker.mapLoadError": "A térkép ehhez a településhez nem tölthető be",
      "tracker.noGpsYet": "még nincs jel",
      "tracker.gpsJustNow": "most frissült ({time})",
      "tracker.gpsMinutesAgo": "{mins} perce ({time})",
      "tracker.gpsHoursAgo": "{hours} órája ({time})",
      "tracker.gpsFreshMobile": "GPS: {freshness}",
      "tracker.gpsStaleMobile": "Utolsó GPS: {freshness} — régi adat",
      "route.today": "Mai útvonal",
      "route.current": "Aktuális",
      "freshness.tagline": "Frissességre tervezve.",
      "stock.dailyTitle": "Napi készlet",
      "stock.dailySubtitle": "Tekintsd meg mozgó pékségünk aktuális választékát.",
      "stock.currentTitle": "Aktuális készlet",
      "stock.currentSubtitle": "Frissen sült kínálatunk közvetlenül a kemencéből.",
      "stock.bread": "Kenyerek",
      "stock.pastry": "Sütemények",
      "stock.categoriesAria": "Készlet kategóriák",
      "stock.inStock": "készleten:",
      "stock.inStockShort": "készleten",
      "stock.unavailable": "nem elérhető",
      "stock.unit": "db",
      "stock.emptyBread": "Jelenleg nincs kenyér a furgon készletén.",
      "stock.emptyPastry": "Jelenleg nincs süti a furgon készletén.",
      "stock.loadError": "A készletlista nem tölthető be.",
      "stock.preorderBadge": "Előrendelés",
      "stock.preorderTitle": "Ünnepi torták és desszertek",
      "stock.preorderText": "Kézműves süteményeinket és tortáinkat már előre is lefoglalhatja különleges alkalmakra.",
      "stock.preorderCta": "Megnézem a kínálatot",
      "stock.premiumBadge": "Prémium ajánlat",
      "stock.orderTitle": "Torta és desszert rendelés",
      "stock.orderText": "Kézműves tortáinkat és desszertjeinket előre is lefoglalhatod.",
      "stock.orderCta": "Rendelés",
      "mobile.onTheWay": "Úton hozzád!",
      "footer.copyright": "© 2024 Babusgatós kézműves pékség",
      "footer.tagline": "Csepregi pékség – minden falat szeretet.",
      "van.popupTitle": "Babusgatós furgon",
      "van.popupEnRoute": "Úton {town} felé",
      "order.meta.title": "Babusgatós — Torta és desszert előrendelés",
      "order.back": "← Vissza a furgonhoz",
      "order.header": "Torta és desszert előrendelés",
      "order.heroTitle": "Torta és desszert rendelés",
      "order.heroText": "A furgon követése után jöhetnek az előrendelhető torták és cukrász kedvencek: méret, íz, felirat és átvétel egy folyamatban.",
      "order.details": "Részletek",
      "order.favorites": "Cukrász kedvencek",
      "order.cakePicker": "Tortaválasztó",
      "order.customize": "Testreszabom",
      "order.addToCart": "Kosárba",
      "order.browse": "Nézem",
      "order.cartTitle": "Torta összeállítás",
      "order.expectedPrice": "Várható ár",
      "order.checkout": "Rendelés véglegesítése",
      "order.navAria": "Fő navigáció",
    },
    de: {
      "meta.title": "Babusgatós — Mobiler Backwagen",
      "header.tagline": "Wo ist der Babusgatós-Transporter?",
      "nav.map": "Karte",
      "nav.stock": "Bestand",
      "nav.order": "Vorbestellung",
      "nav.profile": "Profil",
      "lang.label": "Sprache",
      "map.hint": "Ort suchen — Fahrplan und Karte werden geladen.",
      "map.notToday": "Heute kommen wir nicht zu euch, aber zum folgenden Termin findet ihr uns in eurem Ort:",
      "map.vanLiveAria": "Live-Karte des Transporters",
      "map.openMap": "Karte öffnen",
      "map.liveVanMap": "Live-Transporterkarte",
      "tracker.myTown": "Mein Ort",
      "tracker.townLabel": "Ort:",
      "tracker.searchPlaceholder": "Ort suchen…",
      "tracker.searchShort": "Suchen…",
      "tracker.statusEmpty": "Ort eingeben für den Fahrplan",
      "tracker.arrivalLabel": "Voraussichtliche Ankunft",
      "tracker.arrivalUnavailable": "Zeitpunkt derzeit nicht verfügbar",
      "tracker.liveTracking": "Live-Tracking: {town} · GPS: {freshness}",
      "tracker.liveTrackingStale": "Live-Tracking: {town} · Letztes Signal: {freshness} — OwnTracks prüfen",
      "tracker.schedule": "Fahrplan: {town}",
      "tracker.mapLoadError": "Karte für diesen Ort kann nicht geladen werden",
      "tracker.noGpsYet": "noch kein Signal",
      "tracker.gpsJustNow": "gerade aktualisiert ({time})",
      "tracker.gpsMinutesAgo": "vor {mins} Min. ({time})",
      "tracker.gpsHoursAgo": "vor {hours} Std. ({time})",
      "tracker.gpsFreshMobile": "GPS: {freshness}",
      "tracker.gpsStaleMobile": "Letztes GPS: {freshness} — veraltete Daten",
      "route.today": "Heutige Route",
      "route.current": "Aktuell",
      "freshness.tagline": "Für Frische gemacht.",
      "stock.dailyTitle": "Tagesbestand",
      "stock.dailySubtitle": "Aktuelles Angebot unserer mobilen Bäckerei.",
      "stock.currentTitle": "Aktueller Bestand",
      "stock.currentSubtitle": "Frisch gebacken — direkt aus dem Ofen.",
      "stock.bread": "Brote",
      "stock.pastry": "Gebäck",
      "stock.categoriesAria": "Bestandskategorien",
      "stock.inStock": "auf Lager:",
      "stock.inStockShort": "auf Lager",
      "stock.unavailable": "nicht verfügbar",
      "stock.unit": "Stk.",
      "stock.emptyBread": "Derzeit kein Brot im Transporter.",
      "stock.emptyPastry": "Derzeit kein Gebäck im Transporter.",
      "stock.loadError": "Bestandsliste konnte nicht geladen werden.",
      "stock.preorderBadge": "Vorbestellung",
      "stock.preorderTitle": "Festliche Torten und Desserts",
      "stock.preorderText": "Unsere handgemachten Backwaren und Torten können Sie für besondere Anlässe im Voraus bestellen.",
      "stock.preorderCta": "Angebot ansehen",
      "stock.premiumBadge": "Premium-Angebot",
      "stock.orderTitle": "Torten- und Dessertbestellung",
      "stock.orderText": "Unsere handgemachten Torten und Desserts können Sie im Voraus bestellen.",
      "stock.orderCta": "Bestellen",
      "mobile.onTheWay": "Unterwegs zu dir!",
      "footer.copyright": "© 2024 Babusgatós Handwerksbäckerei",
      "footer.tagline": "Bäckerei in Csepreg – jede Krume mit Liebe.",
      "van.popupTitle": "Babusgatós Transporter",
      "van.popupEnRoute": "Unterwegs nach {town}",
      "order.meta.title": "Babusgatós — Torten- und Dessertvorbestellung",
      "order.back": "← Zurück zum Transporter",
      "order.header": "Torten- und Dessertvorbestellung",
      "order.heroTitle": "Torten- und Dessertbestellung",
      "order.heroText": "Nach der Transporterverfolgung folgen vorbestellbare Torten und Konditorei-Favoriten: Größe, Geschmack, Aufschrift und Abholung in einem Ablauf.",
      "order.details": "Details",
      "order.favorites": "Konditorei-Favoriten",
      "order.cakePicker": "Tortenauswahl",
      "order.customize": "Anpassen",
      "order.addToCart": "In den Warenkorb",
      "order.browse": "Ansehen",
      "order.cartTitle": "Torte zusammenstellen",
      "order.expectedPrice": "Voraussichtlicher Preis",
      "order.checkout": "Bestellung abschließen",
      "order.navAria": "Hauptnavigation",
    },
    en: {
      "meta.title": "Babusgatós — mobile bakery van",
      "header.tagline": "Where is the Babusgatós van?",
      "nav.map": "Map",
      "nav.stock": "Stock",
      "nav.order": "Pre-order",
      "nav.profile": "Profile",
      "lang.label": "Language",
      "map.hint": "Search for a town — schedule and map loading.",
      "map.notToday": "We are not visiting today, but you can find us at your town at the following time:",
      "map.vanLiveAria": "Live van map",
      "map.openMap": "Open map",
      "map.liveVanMap": "Live van map",
      "tracker.myTown": "My town",
      "tracker.townLabel": "Town:",
      "tracker.searchPlaceholder": "Search for a town…",
      "tracker.searchShort": "Search…",
      "tracker.statusEmpty": "Enter a town name for the schedule",
      "tracker.arrivalLabel": "Expected arrival",
      "tracker.arrivalUnavailable": "Time not available yet",
      "tracker.liveTracking": "Live tracking: {town} · GPS: {freshness}",
      "tracker.liveTrackingStale": "Live tracking: {town} · Last signal: {freshness} — check OwnTracks",
      "tracker.schedule": "Schedule: {town}",
      "tracker.mapLoadError": "Map cannot be loaded for this town",
      "tracker.noGpsYet": "no signal yet",
      "tracker.gpsJustNow": "just updated ({time})",
      "tracker.gpsMinutesAgo": "{mins} min ago ({time})",
      "tracker.gpsHoursAgo": "{hours} h ago ({time})",
      "tracker.gpsFreshMobile": "GPS: {freshness}",
      "tracker.gpsStaleMobile": "Last GPS: {freshness} — stale data",
      "route.today": "Today's route",
      "route.current": "Current",
      "freshness.tagline": "Designed for freshness.",
      "stock.dailyTitle": "Daily stock",
      "stock.dailySubtitle": "See the current selection from our mobile bakery.",
      "stock.currentTitle": "Current stock",
      "stock.currentSubtitle": "Freshly baked — straight from the oven.",
      "stock.bread": "Breads",
      "stock.pastry": "Pastries",
      "stock.categoriesAria": "Stock categories",
      "stock.inStock": "in stock:",
      "stock.inStockShort": "in stock",
      "stock.unavailable": "unavailable",
      "stock.unit": "pcs",
      "stock.emptyBread": "No bread on the van right now.",
      "stock.emptyPastry": "No pastries on the van right now.",
      "stock.loadError": "Stock list could not be loaded.",
      "stock.preorderBadge": "Pre-order",
      "stock.preorderTitle": "Celebration cakes and desserts",
      "stock.preorderText": "You can pre-order our artisan pastries and cakes for special occasions.",
      "stock.preorderCta": "View the selection",
      "stock.premiumBadge": "Premium offer",
      "stock.orderTitle": "Cake and dessert orders",
      "stock.orderText": "You can pre-order our artisan cakes and desserts.",
      "stock.orderCta": "Order",
      "mobile.onTheWay": "On the way to you!",
      "footer.copyright": "© 2024 Babusgatós artisan bakery",
      "footer.tagline": "Csepreg bakery — every bite with love.",
      "van.popupTitle": "Babusgatós van",
      "van.popupEnRoute": "En route to {town}",
      "order.meta.title": "Babusgatós — cake and dessert pre-order",
      "order.back": "← Back to the van",
      "order.header": "Cake and dessert pre-order",
      "order.heroTitle": "Cake and dessert orders",
      "order.heroText": "After tracking the van, browse pre-orderable cakes and patisserie favourites: size, flavour, message and pickup in one flow.",
      "order.details": "Details",
      "order.favorites": "Patisserie favourites",
      "order.cakePicker": "Cake picker",
      "order.customize": "Customise",
      "order.addToCart": "Add to cart",
      "order.browse": "Browse",
      "order.cartTitle": "Build your cake",
      "order.expectedPrice": "Estimated price",
      "order.checkout": "Complete order",
      "order.navAria": "Main navigation",
    },
  };

  let currentLang = "hu";

  function normalizeLang(value) {
    const code = String(value || "").toLowerCase().slice(0, 2);
    return SUPPORTED.includes(code) ? code : "hu";
  }

  function getLang() {
    return currentLang;
  }

  function getLocale() {
    return LOCALE[currentLang] || LOCALE.hu;
  }

  function t(key, vars) {
    const bag = MESSAGES[currentLang] || MESSAGES.hu;
    let text = bag[key] ?? MESSAGES.hu[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, String(value));
      });
    }
    return text;
  }

  function stripDiacritics(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase();
  }

  function localizeScheduleSlot(slot) {
    if (!slot || currentLang === "hu") return slot;
    let result = slot;
    const sorted = [...WEEKDAYS].sort((a, b) => b.hu.length - a.hu.length);
    sorted.forEach((day) => {
      const replacement = currentLang === "de" ? day.de : day.en;
      day.keys.forEach((key) => {
        const pattern = new RegExp(`(^|[^\\p{L}])(${key})(?=[^\\p{L}]|$)`, "giu");
        result = result.replace(pattern, `$1${replacement}`);
      });
      const huPattern = new RegExp(`(^|[^\\p{L}])(${day.hu})(?=[^\\p{L}]|$)`, "gu");
      result = result.replace(huPattern, `$1${replacement}`);
    });
    return result;
  }

  function applyI18n(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });
    scope.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (key) el.setAttribute("aria-label", t(key));
    });
    scope.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (key) el.setAttribute("alt", t(key));
    });
    scope.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle("lang-btn--active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setLang(lang, options) {
    const next = normalizeLang(lang);
    if (next === currentLang && !options?.force) return;
    currentLang = next;
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* private mode */
    }
    document.documentElement.lang = next;
    if (document.body.dataset.page === "order") {
      document.title = t("order.meta.title");
    } else {
      document.title = t("meta.title");
    }
    applyI18n();
    document.dispatchEvent(new CustomEvent("babusgatos:langchange", { detail: { lang: next } }));
  }

  function initLangSwitcher() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.lang) setLang(btn.dataset.lang);
      });
    });
  }

  function init() {
    let stored = "hu";
    try {
      stored = localStorage.getItem(LANG_KEY) || "hu";
    } catch {
      stored = "hu";
    }
    currentLang = normalizeLang(stored);
    document.documentElement.lang = currentLang;
    initLangSwitcher();
    applyI18n();
    if (document.body.dataset.page === "order") {
      document.title = t("order.meta.title");
    } else {
      document.title = t("meta.title");
    }
  }

  window.BabusgatosI18n = {
    LANG_KEY,
    SUPPORTED,
    getLang,
    getLocale,
    t,
    setLang,
    applyI18n,
    localizeScheduleSlot,
    init,
  };
})();
