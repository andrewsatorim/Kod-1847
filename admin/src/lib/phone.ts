// Нормализация РФ-телефона к формату iiko: "+7XXXXXXXXXX"
// Возвращает пустую строку, если номер некорректен.
export function normalizePhone(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.startsWith("9") && d.length === 10) d = "7" + d;
  if (d.length !== 11 || !d.startsWith("7")) return "";
  return "+" + d;
}

export function isPhoneValid(raw: string): boolean {
  return normalizePhone(raw) !== "";
}
