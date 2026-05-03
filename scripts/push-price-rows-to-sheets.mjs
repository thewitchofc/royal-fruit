/**
 * דוחף את שורות data/google-sheets-price-append.csv לגיליון Google (Sheets API v4).
 *
 * דרישות:
 * 1. Google Cloud → APIs → הפעילו "Google Sheets API"
 * 2. Service Account + מפתח JSON; העתיקו את client_email
 * 3. בגיליון: שיתוף → הוסיפו את client_email כעורך
 *
 * משתני סביבה:
 *   GOOGLE_SHEET_ID        — מזהה מה-URL: .../spreadsheets/d/THIS_PART/edit
 *   GOOGLE_SERVICE_ACCOUNT_KEY_PATH — נתיב לקובץ JSON של ה-service account
 *   GOOGLE_SHEET_TAB       — (אופציונלי) שם טאב, ברירת מחדל Sheet1
 *   SHEET_APPEND_WITH_HEADER=1 — אם 1, שורת הכותרת מהקובץ תיכלל (לגיליון ריק)
 *
 * הרצה: npm run sheet:push
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_CSV = path.join(ROOT, "data", "google-sheets-price-append.csv");

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQ = true;
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function tabToA1(tab) {
  const safe = String(tab).trim() || "Sheet1";
  if (!/^[A-Za-z0-9_]+$/.test(safe)) {
    return `'${safe.replace(/'/g, "''")}'!A1`;
  }
  return `${safe}!A1`;
}

function loadCsvRows(csvPath) {
  const text = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) {
    throw new Error("CSV ריק או בלי שורות נתונים");
  }
  const header = parseCsvLine(lines[0]);
  const dataLines = lines.slice(1).map(parseCsvLine);
  for (const row of dataLines) {
    if (row.length !== header.length) {
      throw new Error(`שורה עם ${row.length} עמודות, צפוי ${header.length} כמו בכותרת`);
    }
  }
  return { header, rows: dataLines };
}

async function main() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH?.trim();
  const tab = process.env.GOOGLE_SHEET_TAB?.trim() || "Sheet1";
  const withHeader = process.env.SHEET_APPEND_WITH_HEADER === "1";
  const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_CSV;

  if (!spreadsheetId || !keyPath) {
    console.error(`
חסרים משתני סביבה. דוגמה (בטרמינל, לפני npm run sheet:push):

  export GOOGLE_SHEET_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  export GOOGLE_SERVICE_ACCOUNT_KEY_PATH="/נתיב/מלא/service-account.json"
  export GOOGLE_SHEET_TAB="Sheet1"   # אופציונלי

או הוסיפו לקובץ .env והריצו:  export $(grep -v '^#' .env | xargs) && npm run sheet:push

חלופה בלי API: פתחו scripts/google-sheets-append-catalog.gs בגוגל → הרחבות → Apps Script.
`);
    process.exit(1);
  }

  if (!fs.existsSync(keyPath)) {
    console.error(`לא נמצא קובץ מפתח: ${keyPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error(`לא נמצא CSV: ${csvPath}`);
    process.exit(1);
  }

  const { header, rows } = loadCsvRows(csvPath);
  const values = withHeader ? [header, ...rows] : rows;

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const range = tabToA1(tab);
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });

  const updated = res.data.updates?.updatedRows ?? values.length;
  console.log(`בוצע append לטאב «${tab}»: נוספו כ־${updated} שורות (כולל כותרת אם ביקשתם). טווח: ${res.data.updates?.updatedRange ?? "—"}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
