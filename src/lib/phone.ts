// Форматирование и валидация российского номера телефона
// iiko Cloud ожидает формат "+7XXXXXXXXXX" (11 цифр начиная с 7).

// Нормализация: убирает всё кроме цифр, превращает 8→7, возвращает "+7XXXXXXXXXX"
// или пустую строку, если номер некорректен.
export function normalizePhone(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.startsWith("9") && d.length === 10) d = "7" + d;
  if (d.length !== 11 || !d.startsWith("7")) return "";
  return "+" + d;
}

// Проверка валидности (успех нормализации)
export function isPhoneValid(raw: string): boolean {
  return normalizePhone(raw) !== "";
}

// Форматирование для отображения в поле ввода: "+7 (999) 123-45-67"
// Работает с любым вводом, выравнивая под шаблон по мере набора цифр.
export function formatPhoneInput(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d) return "";
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);

  const rest = d.slice(1);
  let out = "+7";
  if (rest.length > 0) out += " (" + rest.slice(0, 3);
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += " " + rest.slice(3, 6);
  if (rest.length > 6) out += "-" + rest.slice(6, 8);
  if (rest.length > 8) out += "-" + rest.slice(8, 10);
  return out;
}
