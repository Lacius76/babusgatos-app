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
      "push.title": "Értesítést kérek",
      "push.descriptionLead": "Ha a furgon a településemre ér, azonnal szólunk!",
      "push.descriptionPrivacy": "Csak az érkezésről értesítünk – semmi személyes adatot nem tárolunk.",
      "push.townsLabel": "Települések",
      "push.addTownPlaceholder": "Település hozzáadása…",
      "push.enable": "🔔 On",
      "push.enabled": "🔔 On",
      "push.disable": "🔔 Off",
      "push.needTown": "Válassz legalább egy települést.",
      "push.permissionDenied": "Az értesítéshez engedélyezd a böngészőben.",
      "push.permissionBlocked": "Az értesítések ki vannak kapcsolva. Engedélyezd a telefon vagy böngésző beállításaiban (pl. Safari: Beállítások → Értesítések → Safari).",
      "push.notSupported": "Ez a böngésző nem támogatja a push értesítést.",
      "push.error": "Nem sikerült bekapcsolni. Próbáld újra később.",
      "push.unavailable": "Az értesítés szervere még nincs beállítva.",
      "push.test": "Teszt értesítés",
      "push.testBody": "🥖 Megérkezett a furgon a településeden!",
      "push.arrivalBody": "🥖 Megérkezett a Babusgatós furgon! Gyere gyorsan, amíg van készlet!",
      "push.testSent": "Teszt elküldve — nézd a képernyő tetejét!",
      "push.testFailed": "A teszt értesítés nem jött le. Ellenőrizd a böngésző értesítés-beállításait.",
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
      "footer.copyright": "© 2026 Földváry László (Laszlo.UI). Minden jog fenntartva.",
      "footer.tagline": "Powered by Laszlo.UI · foeldvary.com",
      "footer.credit": "A koncepciót és a szoftveralkalmazást a Babusgatós részére tervezte és készítette: Földváry László.",
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
      "checkout.meta.title": "Babusgatós — Rendelés és fizetés",
      "checkout.header": "Rendelés véglegesítése",
      "checkout.back": "← Vissza az előrendeléshez",
      "checkout.cartTitle": "Kosarad tartalma",
      "checkout.paymentTitle": "Fizetési mód",
      "checkout.payCard": "Bankkártya",
      "checkout.payPaypal": "PayPal",
      "checkout.payVan": "Fizetés a furgonnál átvételkor",
      "checkout.contactTitle": "Kapcsolati adatok",
      "checkout.name": "Név",
      "checkout.email": "E-mail",
      "checkout.phone": "Telefonszám",
      "checkout.pay": "Fizetés",
      "checkout.namePlaceholder": "Teljes név",
      "checkout.emailPlaceholder": "pelda@email.com",
      "checkout.phonePlaceholder": "+36 …",
      "checkout.required": "Kérjük, töltsd ki az összes mezőt, és válassz fizetési módot.",
      "checkout.successTitle": "Sikeresen fizetve",
      "checkout.successLead": "Köszönjük! A rendelésed rögzítettük.",
      "checkout.successBody": "Amikor a furgon legközelebb a településeden jár, átveheted a rendelésedet. Az átvételről e-mailben is értesítünk.",
      "checkout.selectedPayment": "Választott fizetési mód",
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
      "push.title": "Benachrichtigung",
      "push.descriptionLead": "Wenn der Transporter in meinem Ort ankommt.",
      "push.descriptionPrivacy": "Wir speichern keine persönlichen Daten.",
      "push.townsLabel": "Orte",
      "push.addTownPlaceholder": "Ort hinzufügen…",
      "push.enable": "🔔 On",
      "push.enabled": "🔔 On",
      "push.disable": "🔔 Off",
      "push.needTown": "Wähle mindestens einen Ort.",
      "push.permissionDenied": "Bitte Benachrichtigungen im Browser erlauben.",
      "push.permissionBlocked": "Benachrichtigungen sind deaktiviert. Bitte in den Telefon- oder Browser-Einstellungen erlauben.",
      "push.notSupported": "Push-Benachrichtigungen werden nicht unterstützt.",
      "push.error": "Aktivierung fehlgeschlagen. Bitte später erneut versuchen.",
      "push.unavailable": "Benachrichtigungsserver ist noch nicht eingerichtet.",
      "push.test": "Testbenachrichtigung",
      "push.testBody": "🥖 Der Transporter ist in deiner Ortschaft!",
      "push.arrivalBody": "🥖 Der Babusgatós-Transporter ist da! Komm schnell, solange der Vorrat reicht!",
      "push.testSent": "Test gesendet — schau oben auf den Bildschirm!",
      "push.testFailed": "Test fehlgeschlagen. Prüfe die Browser-Benachrichtigungen.",
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
      "footer.copyright": "© 2026 Földváry László (Laszlo.UI). Alle Rechte vorbehalten.",
      "footer.tagline": "Powered by Laszlo.UI · foeldvary.com",
      "footer.credit": "Konzept und Softwareanwendung entwickelt für Babusgatós von Földváry László.",
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
      "checkout.meta.title": "Babusgatós — Bestellung und Zahlung",
      "checkout.header": "Bestellung abschließen",
      "checkout.back": "← Zurück zur Vorbestellung",
      "checkout.cartTitle": "Dein Warenkorb",
      "checkout.paymentTitle": "Zahlungsart",
      "checkout.payCard": "Bankkarte",
      "checkout.payPaypal": "PayPal",
      "checkout.payVan": "Zahlung bei Abholung am Transporter",
      "checkout.contactTitle": "Kontaktdaten",
      "checkout.name": "Name",
      "checkout.email": "E-Mail",
      "checkout.phone": "Telefonnummer",
      "checkout.pay": "Bezahlen",
      "checkout.namePlaceholder": "Vollständiger Name",
      "checkout.emailPlaceholder": "beispiel@email.com",
      "checkout.phonePlaceholder": "+36 …",
      "checkout.required": "Bitte alle Felder ausfüllen und eine Zahlungsart wählen.",
      "checkout.successTitle": "Erfolgreich bezahlt",
      "checkout.successLead": "Danke! Deine Bestellung ist erfasst.",
      "checkout.successBody": "Wenn der Transporter das nächste Mal in deinem Ort ist, kannst du deine Bestellung abholen. Wir benachrichtigen dich auch per E-Mail.",
      "checkout.selectedPayment": "Gewählte Zahlungsart",
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
      "push.title": "Notify me",
      "push.descriptionLead": "When the van reaches my town.",
      "push.descriptionPrivacy": "We store no personal data.",
      "push.townsLabel": "Towns",
      "push.addTownPlaceholder": "Add a town…",
      "push.enable": "🔔 On",
      "push.enabled": "🔔 On",
      "push.disable": "🔔 Off",
      "push.needTown": "Select at least one town.",
      "push.permissionDenied": "Please allow notifications in your browser.",
      "push.permissionBlocked": "Notifications are blocked. Enable them in your phone or browser settings.",
      "push.notSupported": "Push notifications are not supported here.",
      "push.error": "Could not enable. Try again later.",
      "push.unavailable": "Notification server is not configured yet.",
      "push.test": "Test notification",
      "push.testBody": "🥖 The van is in your town!",
      "push.arrivalBody": "🥖 The Babusgatós van has arrived! Come quickly while supplies last!",
      "push.testSent": "Test sent — check the top of your screen!",
      "push.testFailed": "Test failed. Check your browser notification settings.",
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
      "footer.copyright": "© 2026 Földváry László (Laszlo.UI). All rights reserved.",
      "footer.tagline": "Powered by Laszlo.UI · foeldvary.com",
      "footer.credit": "Concept and software application created for Babusgatós.",
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
      "checkout.meta.title": "Babusgatós — Order and payment",
      "checkout.header": "Complete your order",
      "checkout.back": "← Back to pre-order",
      "checkout.cartTitle": "Your cart",
      "checkout.paymentTitle": "Payment method",
      "checkout.payCard": "Bank card",
      "checkout.payPaypal": "PayPal",
      "checkout.payVan": "Pay at the van on pickup",
      "checkout.contactTitle": "Contact details",
      "checkout.name": "Name",
      "checkout.email": "Email",
      "checkout.phone": "Phone number",
      "checkout.pay": "Pay",
      "checkout.namePlaceholder": "Full name",
      "checkout.emailPlaceholder": "you@email.com",
      "checkout.phonePlaceholder": "+36 …",
      "checkout.required": "Please fill in all fields and choose a payment method.",
      "checkout.successTitle": "Successfully paid",
      "checkout.successLead": "Thank you! Your order is recorded.",
      "checkout.successBody": "When the van next visits your town, you can pick up your order. We’ll also notify you by email.",
      "checkout.selectedPayment": "Selected payment method",
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
    } else if (document.body.dataset.page === "checkout") {
      document.title = t("checkout.meta.title");
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
    } else if (document.body.dataset.page === "checkout") {
      document.title = t("checkout.meta.title");
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
