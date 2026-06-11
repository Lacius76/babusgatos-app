/**
 * Készlet Google Sheets fülök (gid) nyelvenként.
 * bread: null = első fül (magyar kenyer)
 * Új fül gid: nyisd meg a fület → URL-ben #gid=123456789
 *
 * Fontos: File → Megosztás → Közzététel a weben — minden fül legyen elérhető.
 */
window.BabusgatosStockSheets = {
  publishBase:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRnimU6TVZDlbAO1F8ESK6lLAn2As8R1AJYuFaE97aamFCNuCGbVpLV2jVdxuLaPwU8HhlH4XcObRo/pub",
  tabs: {
    hu: { bread: null, pastry: "1011203089" },
    en: { bread: "1938676589", pastry: "1815735904" },
    de: { bread: "619732414", pastry: "1981038947" },
  },
};
