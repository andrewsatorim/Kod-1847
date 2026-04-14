import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Код 1847",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">← Вернуться на главную</Link>
        <h1 className="legal-title">Политика конфиденциальности</h1>
        <p className="legal-date">Редакция от 13.04.2026 | kod1847.ru</p>

        <h2>1. Общие положения</h2>
        <p>Настоящая Политика конфиденциальности (далее — Политика) определяет порядок обработки и защиты персональных данных пользователей (далее — Пользователь) веб-сайта kod1847.ru (далее — Сайт), принадлежащего Обществу с ограниченной ответственностью «РАНИКО» (ООО «РАНИКО») (далее — Оператор).</p>
        <p>Юридический адрес Оператора: <span className="legal-num">125364</span>, г. Москва, муниципальный округ Северное Тушино, б-р Химкинский, д. <span className="legal-num">14</span>, к. <span className="legal-num">1</span>, помещ. <span className="legal-num">4/1</span>. ИНН: <span className="legal-num">7743340610</span>. КПП: <span className="legal-num">773301001</span>. ОГРН: <span className="legal-num">1207700189575</span>.</p>
        <p>Ответственное лицо за организацию обработки персональных данных: Лепин Алексей Александрович.</p>
        <p>Политика разработана в соответствии с Федеральным законом от <span className="legal-num">27.07.2006</span> N <span className="legal-num">152</span>-ФЗ «О персональных данных», Федеральным законом от <span className="legal-num">27.07.2006</span> N <span className="legal-num">149</span>-ФЗ «Об информации, информационных технологиях и о защите информации» и иными нормативными правовыми актами Российской Федерации.</p>

        <h2>2–11. Полный текст</h2>
        <p>Полный текст разделов 2–11 представлен в документе на сайте.</p>
        <p>По всем вопросам: info@kod1847.ru | <span className="legal-num">+7 (901) 535-90-00</span></p>
      </div>
    </main>
  );
}
