import Link from "next/link";
import Footer from "@/components/Footer";

interface Props {
  title: string;
  date: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, date, children }: Props) {
  return (
    <>
      <div className="legal-page">
        <div className="legal-header">
          <Link href="/" className="legal-back">
            &larr; Вернуться на главную
          </Link>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-date">Редакция от {date} | kod1847.ru</p>
        </div>
        <div className="legal-content">{children}</div>
      </div>
      <Footer />
    </>
  );
}
