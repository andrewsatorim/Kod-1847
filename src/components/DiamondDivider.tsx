export default function DiamondDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`section-divider ${className}`}>
      <div className="div-line" />
      <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="#B89860" opacity="0.45" />
      </svg>
      <div className="div-line" />
    </div>
  );
}
