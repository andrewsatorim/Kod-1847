export default function Loading() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: "1px solid rgba(184,152,96,0.2)",
        borderTopColor: "#B89860",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
