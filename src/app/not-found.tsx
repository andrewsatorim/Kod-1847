import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "24px",
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Bodoni Moda',serif",
        fontSize: 72,
        color: "#B89860",
        marginBottom: 16,
      }}>404</div>
      <div style={{
        fontFamily: "'Raleway',sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: "#9A958B",
        letterSpacing: "4px",
        textTransform: "uppercase" as const,
        marginBottom: 48,
      }}>Страница не найдена</div>
      <Link
        href="/"
        style={{
          fontFamily: "'Raleway',sans-serif",
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "4px",
          textTransform: "uppercase" as const,
          color: "#B89860",
          border: "1px solid rgba(184,152,96,0.35)",
          padding: "14px 36px",
          textDecoration: "none",
          transition: "all 0.4s",
        }}
      >
        На главную
      </Link>
    </div>
  );
}
