/**
 * Royal Fruit — הוספת שורות מחירון (חלווה + מטבח טרי) לגיליון ROYAL FRUIT.
 *
 * מבנה העמודות בגיליון (כמו בשורה 1 אצלכם):
 *   name | price | category | type | unit | deal | Checkbox
 *
 * דרך א׳: הרחבות / כלים → Apps Script (מתוך הגיליון) → הריצו appendRoyalFruitCatalog
 * דרך ב׳: https://script.google.com/home/start → הדביקו קוד → הריצו appendRoyalFruitCatalogBySpreadsheetId
 *
 * מזהה מה-URL: .../spreadsheets/d/המזהה/edit
 */

/** מזהה הגיליון שלכם (ROYAL FRUIT) — אפשר להשאיר; לגיליון אחר החליפו */
var SPREADSHEET_ID = '1_AkC5r-MMylax6iXMwZ_JRSoWkqHMw3GYodO6wnT10w';

/** שם טאב כפי שמופיע למטה; ריק = הטאב הראשון (לרוב «גיליון1») */
var SHEET_TAB_NAME = '';

/** מספר עמודות כמו בגיליון (A–G) */
var NUM_COLS = 7;

/**
 * כל שורה: name, price, category, type, unit, deal, Checkbox
 * Checkbox = true כדי שהמוצר ייחשב זמין בייצוא CSV לאתר
 */
function getCatalogRows_() {
  return [
    ['אגוזי לוז', '35', 'חלווה בטעם', 'חלווה', '', '', true],
    ['פיסטק', '35', 'חלווה בטעם', 'חלווה', '', '', true],
    ['פקאן', '35', 'חלווה בטעם', 'חלווה', '', '', true],
    ['טעם של פעם', '35', 'חלווה בטעם', 'חלווה', '', '', true],
    ['טחינה אתיופית', '30', 'טחינה וקרמים', 'חלווה', '', '', true],
    ['טחינה מלאה עם וניל טהור', '30', 'טחינה וקרמים', 'חלווה', '', '', true],
    ['טחינה עם אגוזי לוז וקקאו', '30', 'טחינה וקרמים', 'חלווה', '', '', true],
    ['קרם פיסטוק', '30', 'טחינה וקרמים', 'חלווה', '', '', true],
    ['קרם אגוזי לוז', '30', 'טחינה וקרמים', 'חלווה', '', '', true],
    ['250 גרם', '35', 'עלי גפן חמוצים', 'מטבח טרי', '', '', true],
    ['500 גרם', '65', 'עלי גפן חמוצים', 'מטבח טרי', '', '', true],
    ['1 קילו', '125', 'עלי גפן חמוצים', 'מטבח טרי', '', '', true],
    ['250 גרם', '45', 'כרוב חמוץ', 'מטבח טרי', '', '', true],
    ['500 גרם', '80', 'כרוב חמוץ', 'מטבח טרי', '', '', true],
    ['1 קילו', '155', 'כרוב חמוץ', 'מטבח טרי', '', '', true],
    ['250 גרם', '40', 'בצל חמוץ מתוק', 'מטבח טרי', '', '', true],
    ['500 גרם', '75', 'בצל חמוץ מתוק', 'מטבח טרי', '', '', true],
    ['1 קילו', '140', 'בצל חמוץ מתוק', 'מטבח טרי', '', '', true]
  ];
}

function appendCatalogToSheet_(sheet, ssForToast) {
  var rows = getCatalogRows_();
  var header = [['name', 'price', 'category', 'type', 'unit', 'deal', 'Checkbox']];
  var last = sheet.getLastRow();
  var start;
  if (last === 0) {
    sheet.getRange(1, 1, 1, NUM_COLS).setValues(header);
    start = 2;
  } else {
    start = last + 1;
  }
  sheet.getRange(start, 1, start + rows.length - 1, NUM_COLS).setValues(rows);
  if (ssForToast && ssForToast.toast) {
    ssForToast.toast('נוספו ' + rows.length + ' שורות', 'Royal Fruit', 5);
  }
}

function appendRoyalFruitCatalog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('אין גיליון פעיל. הריצו appendRoyalFruitCatalogBySpreadsheetId');
  }
  appendCatalogToSheet_(ss.getActiveSheet(), ss);
}

function appendRoyalFruitCatalogBySpreadsheetId() {
  var id = String(SPREADSHEET_ID || '').trim();
  if (!id) {
    throw new Error('מלאו SPREADSHEET_ID בראש הקובץ');
  }
  var ss = SpreadsheetApp.openById(id);
  var sheet;
  var tab = String(SHEET_TAB_NAME || '').trim();
  if (tab) {
    sheet = ss.getSheetByName(tab);
    if (!sheet) {
      throw new Error('לא נמצא טאב: ' + tab);
    }
  } else {
    sheet = ss.getSheets()[0];
  }
  appendCatalogToSheet_(sheet, ss);
}
