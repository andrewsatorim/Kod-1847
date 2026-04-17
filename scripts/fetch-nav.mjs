import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB = "postgresql://kod1847:Kod1847pg2026@localhost:5432/kod1847";

const sql = "SELECT key,href,title_ru,title_en,nav_order,is_visible FROM nav_sections WHERE is_visible=TRUE ORDER BY nav_order";
const raw = execSync(`psql "${DB}" -t -A -F '||SEP||' -c "${sql}"`).toString().trim();

const rows = raw.split("\n").filter(Boolean).map((line) => {
  const [key, href, title_ru, title_en, nav_order, is_visible] = line.split("||SEP||");
  return { key, href, title_ru, title_en, nav_order: Number(nav_order), is_visible: is_visible === "t" };
});

const dataDir = path.join(__dirname, "../src/data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "nav.json"), JSON.stringify(rows, null, 2));
console.log(`Записано ${rows.length} разделов в src/data/nav.json`);
