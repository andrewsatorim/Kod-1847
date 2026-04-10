"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        fontSize: 28,
        color: "#B89860",
        marginBottom: 16,
      }}>Что-то пошло не так</div>
      <div style={{
        fontFamily: "'Raleway',sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: "#9A958B",
        marginBottom: 48,
      }}>Произошла ошибка при загрузке страницы</div>
      <button
        onClick={reset}
        style={{
          fontFamily: "'Raleway',sans-serif",
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#B89860",
          background: "transparent",
          border: "1px solid rgba(184,152,96,0.35)",
          padding: "14px 36px",
          cursor: "pointer",
          transition: "all 0.4s",
        }}
      >
        Попробовать снова
      </button>
    </div>
  );
}
